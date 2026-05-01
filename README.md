# MindMori AI 森智守護 🛡️
### 阿茲海默症初步健康風險篩檢平台

---

## 資料夾結構

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

## 本地開發啟動（每次都需要執行）

### 終端機 1 — 啟動後端

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

### 終端機 2 — 啟動前端

```powershell
cd frontend

# 第一次使用才需要執行
npm install

# 每次啟動執行
npm run dev
```

看到 `Local: http://localhost:3000/` 後，打開瀏覽器訪問該網址。

> ⚠️ 兩個終端機都必須同時保持開著，網站才能正常運作。

---

## 部署到 Google Cloud Run（後端）

```powershell
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
gcloud config set run/region asia-east1
gcloud services enable run.googleapis.com cloudbuild.googleapis.com

cd backend
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/mindmori-backend
gcloud run deploy mindmori-backend \
  --image gcr.io/YOUR_PROJECT_ID/mindmori-backend \
  --platform managed \
  --region asia-east1 \
  --allow-unauthenticated \
  --memory 1Gi \
  --port 8080
```

## 部署前端到 Vercel

1. 前往 vercel.com 用 GitHub 登入
2. Import 你的 GitHub repository
3. Root Directory 設為 `frontend`
4. 新增環境變數 `VITE_API_URL` = 你的 Cloud Run 網址
5. Deploy

---

## 費用

| 服務 | 費用 |
|---|---|
| Vercel 前端 | 免費 |
| Google Cloud Run | 每月前 200 萬次請求免費 |
| GitHub | 免費 |
