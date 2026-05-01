"""
train_model.py
Trains the XGBoost pipeline on alzheimers_disease_data.csv and saves it as
alzheimers_pipeline.pkl.  Mirrors the preprocessing in Dementia_Cloud.ipynb.
"""

import pandas as pd
import numpy as np
import pickle
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from xgboost import XGBClassifier
from sklearn.metrics import classification_report, roc_auc_score


def train_and_save_model(
    data_path: str = "alzheimers_disease_data.csv",
    model_path: str = "alzheimers_pipeline.pkl",
):
    # ── 1. Load & clean ──────────────────────────────────────────────────────
    df = pd.read_csv(data_path)
    df = df.drop(columns=["PatientID", "DoctorInCharge"], errors="ignore")
    df = df.drop_duplicates()

    # ── 2. Feature engineering (mirrors Cell 4e) ─────────────────────────────
    df["CognitiveDeclineIndex"] = (
        (30 - df["MMSE"]) +
        (10 - df["FunctionalAssessment"]) +
        (10 - df["ADL"])
    ) / 50

    df["CardiovascularRiskScore"] = (
        df["CardiovascularDisease"] +
        df["Hypertension"] +
        df["Diabetes"] +
        df["Smoking"]
    )

    df["BehaviouralSymptomBurden"] = (
        df["MemoryComplaints"] +
        df["BehavioralProblems"] +
        df["Confusion"] +
        df["Disorientation"] +
        df["PersonalityChanges"] +
        df["DifficultyCompletingTasks"] +
        df["Forgetfulness"]
    )

    df["CholesterolRatio"] = df["CholesterolLDL"] / (df["CholesterolHDL"] + 1e-6)
    df["PulsePressure"]    = df["SystolicBP"] - df["DiastolicBP"]

    # ── 3. Feature split ─────────────────────────────────────────────────────
    categorical_cols = [
        "Gender", "Ethnicity", "EducationLevel", "Smoking",
        "FamilyHistoryAlzheimers", "CardiovascularDisease", "Diabetes",
        "Depression", "HeadInjury", "Hypertension", "MemoryComplaints",
        "BehavioralProblems", "Confusion", "Disorientation",
        "PersonalityChanges", "DifficultyCompletingTasks", "Forgetfulness",
    ]
    categorical_cols = [c for c in categorical_cols if c in df.columns]
    numeric_cols = [
        c for c in df.columns
        if c not in categorical_cols + ["Diagnosis"]
    ]

    X = df.drop("Diagnosis", axis=1)
    y = df["Diagnosis"]

    # ── 4. Train / test split ─────────────────────────────────────────────────
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # ── 5. Preprocessing pipeline ─────────────────────────────────────────────
    numeric_transformer = Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler",  StandardScaler()),
    ])
    categorical_transformer = Pipeline([
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("encoder", OneHotEncoder(handle_unknown="ignore")),
    ])
    preprocessor = ColumnTransformer([
        ("num", numeric_transformer, numeric_cols),
        ("cat", categorical_transformer, categorical_cols),
    ])

    # ── 6. Class imbalance correction ─────────────────────────────────────────
    scale_pos_weight = (y_train == 0).sum() / (y_train == 1).sum()

    # ── 7. XGBoost model ─────────────────────────────────────────────────────
    xgb = XGBClassifier(
        n_estimators=200,
        max_depth=5,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        eval_metric="logloss",
        scale_pos_weight=scale_pos_weight,
        random_state=42,
    )

    model = Pipeline([
        ("preprocessor", preprocessor),
        ("classifier",   xgb),
    ])
    model.fit(X_train, y_train)

    # ── 8. Evaluation ────────────────────────────────────────────────────────
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]
    print("=== Model Evaluation ===")
    print(classification_report(y_test, y_pred))
    print("ROC-AUC:", round(roc_auc_score(y_test, y_prob), 4))

    # ── 9. Save ──────────────────────────────────────────────────────────────
    with open(model_path, "wb") as f:
        pickle.dump(model, f)
    print(f"Model saved to {model_path}")
    return model


if __name__ == "__main__":
    train_and_save_model()
