import { NextResponse } from "next/server";

export const dynamic = 'force-static';


export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    const response = await fetch(url, {
      // 添加请求头以避免某些服务器的限制
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch YAML: ${response.statusText}`);
    }

    const text = await response.text();

    return new NextResponse(text, {
      headers: {
        'Content-Type': 'application/yaml',
        'Content-Disposition': 'attachment; filename="config.yaml"'
      }
    })
  } catch (error) {
    console.error("Error downloading YAML:", error);
    return NextResponse.json(
      { error: "Failed to download YAML file" },
      { status: 500 }
    );
  }
}
