## 👋 Introduction

Contextual Ad is a tool that allows you to analyze your source footage, generate a summary, and receive ad recommendations based on the content and emotional tone of the footage. It also suggests optimal ad placements, enabling you to preview how the footage and ads work together. Additionally, you can generate ad copies, headlines, and hashtags for each ad!

https://github.com/user-attachments/assets/7a406f6c-d100-4942-bb80-a4d7e7c3b4c2

## 📍 Process Map

<div align="center">
    <img src="public/processMap.png" alt="process map" />
  </a>
</div>

1. Upload new footage or use existing content from the footage index
2. Get a summary of a footage on Event Type, Main Content, and Emotional Tone. 
3. Get AI-powered ad recommendations based on your preferred criteria (general, emotional, visual, or custom)
4. Generate matching ad copy, headlines, and hashtags
5. Preview recommended ad placements within your footage

## 🛠️ Built With

- Next.js
- React
- TypeScript
- React Player
- Tailwind CSS
- Tanstack Query

## 🧱 Components

<div align="center">
    <img src="public/componentDesign.png" alt="process map" />
  </a>
</div>

## 🚀 Prerequisites

### 1. Twelve Labs API Key

If you don't have one, visit [Twelve Labs Playground](https://playground.twelvelabs.io/) to generate your API Key.

### 2.Index Ids for source footage and ads

Make sure you have two indexes for source footage and ads. If not,

- Check [here](https://docs.twelvelabs.io/docs/create-indexes) on how to create an index and get the index id
- When creating an index, check “Logo” and “Text in Video” under “More options”
  <img src="public/index_options.png" alt="index options" width="300"/>

## 🔑 Getting Started

### 1. Clone the current repo

```sh
git clone git@github.com:mrnkim/contextual-ad.git
```

### 2. Create `.env` file in the root directory and provide the values for each key

```
TWELVELABS_API_BASE_URL=https://api.twelvelabs.io/v1.2
TWELVELABS_API_KEY=<YOUR API KEY>
NEXT_PUBLIC_FOOTAGE_INDEX_ID=<YOUR FOOTAGE INDEX ID>
NEXT_PUBLIC_ADS_INDEX_ID=<YOUR ADS INDEX ID>
```

### 3. Run the development server

```bash
npm install
npm run dev
```

### 4. Open [http://localhost:3000](http://localhost:3000) with your browser
