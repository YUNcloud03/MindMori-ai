from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import pickle
import os
from train_model import train_and_save_model

app = FastAPI(title="MindMori AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "alzheimers_pipeline.pkl"

@app.on_event("startup")
async def startup_event():
    if not os.path.exists(MODEL_PATH):
        print("Training model...")
        train_and_save_model()
        print("Model trained and saved.")
    else:
        print("Model already exists, loading...")

def load_model():
    with open(MODEL_PATH, "rb") as f:
        return pickle.load(f)

class PredictionInput(BaseModel):
    Age: int
    Gender: int
    Ethnicity: int
    EducationLevel: int
    BMI: float
    Smoking: int
    AlcoholConsumption: float
    PhysicalActivity: float
    DietQuality: float
    SleepQuality: float
    FamilyHistoryAlzheimers: int
    CardiovascularDisease: int
    Diabetes: int
    Depression: int
    HeadInjury: int
    Hypertension: int
    SystolicBP: int
    DiastolicBP: int
    CholesterolTotal: float
    CholesterolLDL: float
    CholesterolHDL: float
    CholesterolTriglycerides: float
    MMSE: float
    FunctionalAssessment: float
    MemoryComplaints: int
    BehavioralProblems: int
    ADL: float
    Confusion: int
    Disorientation: int
    PersonalityChanges: int
    DifficultyCompletingTasks: int
    Forgetfulness: int

class PredictionOutput(BaseModel):
    risk_probability: float
    risk_percentage: float
    risk_level: str
    risk_label_zh: str
    prediction: int
    radar_scores: dict
    recommendation_tier: str

# 全體資料集平均值（由 alzheimers_disease_data.csv 實際計算，n=2149）
POPULATION_AVG = {
    "memory":       59.3,
    "executive":    66.5,
    "language":     70.4,
    "attention":    77.3,
    "daily_living": 49.7,
}

def compute_radar_scores(data: dict) -> dict:
    mmse           = data["MMSE"]
    functional     = data["FunctionalAssessment"]
    adl            = data["ADL"]
    memory_c       = data["MemoryComplaints"]
    behavioral     = data["BehavioralProblems"]
    confusion      = data["Confusion"]
    disorientation = data["Disorientation"]
    personality    = data["PersonalityChanges"]
    difficulty     = data["DifficultyCompletingTasks"]
    forgetfulness  = data["Forgetfulness"]
    sleep          = data["SleepQuality"]
    diet           = data["DietQuality"]
    physical       = data["PhysicalActivity"]

    memory_score = round(max(0, min(100,
        (mmse / 30) * 60 +
        (1 - memory_c) * 20 +
        (1 - forgetfulness) * 20
    )))
    executive_score = round(max(0, min(100,
        (functional / 10) * 50 +
        (1 - difficulty) * 30 +
        (1 - confusion) * 20
    )))
    language_score = round(max(0, min(100,
        (mmse / 30) * 40 +
        (1 - disorientation) * 30 +
        (1 - personality) * 30
    )))
    attention_score = round(max(0, min(100,
        (sleep / 10) * 40 +
        (1 - confusion) * 30 +
        (1 - behavioral) * 30
    )))
    daily_living_score = round(max(0, min(100,
        (adl / 10) * 50 +
        (diet / 10) * 25 +
        (physical / 10) * 25
    )))

    return {
        "memory":           memory_score,
        "executive":        executive_score,
        "language":         language_score,
        "attention":        attention_score,
        "daily_living":     daily_living_score,
        "avg_memory":       POPULATION_AVG["memory"],
        "avg_executive":    POPULATION_AVG["executive"],
        "avg_language":     POPULATION_AVG["language"],
        "avg_attention":    POPULATION_AVG["attention"],
        "avg_daily_living": POPULATION_AVG["daily_living"],
    }

@app.get("/")
async def root():
    return {"message": "MindMori AI API is running", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/predict", response_model=PredictionOutput)
async def predict(data: PredictionInput):
    try:
        model = load_model()
        input_dict = data.dict()

        # 特徵工程（與 train_model.py 及 Dementia_Cloud.ipynb 完全一致）
        mmse       = input_dict["MMSE"]
        functional = input_dict["FunctionalAssessment"]
        adl        = input_dict["ADL"]

        input_dict["CognitiveDeclineIndex"] = (
            (30 - mmse) + (10 - functional) + (10 - adl)
        ) / 50

        input_dict["CardiovascularRiskScore"] = (
            input_dict["CardiovascularDisease"] +
            input_dict["Hypertension"] +
            input_dict["Diabetes"] +
            input_dict["Smoking"]
        )

        input_dict["BehaviouralSymptomBurden"] = (
            input_dict["MemoryComplaints"] +
            input_dict["BehavioralProblems"] +
            input_dict["Confusion"] +
            input_dict["Disorientation"] +
            input_dict["PersonalityChanges"] +
            input_dict["DifficultyCompletingTasks"] +
            input_dict["Forgetfulness"]
        )

        input_dict["CholesterolRatio"] = (
            input_dict["CholesterolLDL"] / (input_dict["CholesterolHDL"] + 1e-6)
        )

        input_dict["PulsePressure"] = (
            input_dict["SystolicBP"] - input_dict["DiastolicBP"]
        )

        df_input = pd.DataFrame([input_dict])

        prediction  = int(model.predict(df_input)[0])
        probability = float(model.predict_proba(df_input)[0][1])
        percentage  = round(probability * 100, 1)

        if probability < 0.30:
            risk_level          = "low"
            risk_label_zh       = "低風險"
            recommendation_tier = "maintain"
        elif probability < 0.70:
            risk_level          = "medium"
            risk_label_zh       = "中風險"
            recommendation_tier = "monitor"
        else:
            risk_level          = "high"
            risk_label_zh       = "高風險"
            recommendation_tier = "urgent"

        radar_scores = compute_radar_scores(input_dict)

        return PredictionOutput(
            risk_probability    = probability,
            risk_percentage     = percentage,
            risk_level          = risk_level,
            risk_label_zh       = risk_label_zh,
            prediction          = prediction,
            radar_scores        = radar_scores,
            recommendation_tier = recommendation_tier,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))