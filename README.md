<<<<<<< HEAD
# MindMori AI 森智守護
=======
# MindMori AI 森智守護 
### 阿茲海默症初步健康風險篩檢平台

---
## Motivation

Taiwan has already become an aging society, and the proportion of older adults continues to grow. As the elderly population increases, issues related to aging deserve greater attention from both families and society.

At the same time, many adult children need to leave their hometowns for work, which means that many older family members live alone and receive less day-to-day companionship and observation from their families. Under these circumstances, hidden conditions such as Alzheimer’s disease can be especially difficult to notice in the early stages. In many cases, the condition is only discovered after symptoms have become more obvious.

This project was created with the hope of providing a simple and accessible preliminary screening tool. By answering a set of basic questions, older adults or their family members may gain an early indication of possible Alzheimer’s-related risk. This can encourage families to seek professional medical evaluation earlier, allowing for earlier detection, earlier intervention, and better preparation for future care.

## Folder Structure

```
cogniguard/
├── backend/                    ← FastAPI + XGBoost 後端
│   ├── main.py                 ← API 主程式
│   ├── train_model.py          ← 模型訓練腳本
│   ├── alzheimers_disease_data.csv
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/                   ← React 前端
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── pages/
│   │   │   ├── LoadingPage.jsx
│   │   │   ├── IntroPage.jsx
│   │   │   ├── TermsPage.jsx
│   │   │   ├── ConsentPage.jsx
│   │   │   ├── QuestionnairePage.jsx
│   │   │   └── ResultPage.jsx
│   │   └── utils/
│   │       ├── questions.js
│   │       ├── recommendations.js
│   │       └── api.js
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── cogniguard.code-workspace
└── README.md
```

---

## Quick usage

### Terminal 1 — activate backend system

```powershell
cd backend

# 第一次使用才需要執行以下三行
python -m venv .venv
pip install -r requirements.txt
python train_model.py

# 每次啟動執行
.venv\Scripts\activate
uvicorn main:app --reload --port 8080
```

看到 `Uvicorn running on http://127.0.0.1:8080` 代表成功。

### Terminal 2 — activate frontend page

```powershell
cd frontend

# 第一次使用才需要執行
npm install

# 每次啟動執行
npm run dev
```

看到 `Local: http://localhost:3000/` 後，打開瀏覽器訪問該網址。

> 兩個終端機都必須同時保持開著，網站才能正常運作。
<<<<<<< HEAD

---





=======
>>>>>>> ac029aa86ff1a2ec1ef1ee9f9ebe5da2cc2994dc
