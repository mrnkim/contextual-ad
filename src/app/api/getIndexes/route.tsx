import { NextResponse } from "next/server";

const API_KEY = process.env.TWELVELABS_API_KEY;
const TWELVELABS_API_BASE_URL = process.env.TWELVELABS_API_BASE_URL;

const PAGE_LIMIT = 5;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page");

  if (!page) {
    return NextResponse.json(
      { error: "page is required" },
      { status: 400 }
    );
  }

  const url = `${TWELVELABS_API_BASE_URL}/indexes?page=${page}&page_limit=${PAGE_LIMIT}`;

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "applicatoin/json",
      "x-api-key": `${API_KEY}`,
    },
  };

  try {
    const response = await fetch(url, options);
    console.log("🚀 > GET > response=", response)

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
