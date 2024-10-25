import { NextResponse } from "next/server";
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-static';

export async function GET() {
  try {
    const templatesDir = path.join(process.cwd(), 'data/templates');
    const builtInPath = path.join(templatesDir, 'built-in.yaml');

    const builtInTemplate = await fs.readFile(builtInPath, 'utf-8');

    // 读取用户保存的自定义模板
    const files = await fs.readdir(templatesDir);
    const customTemplates = await Promise.all(
      files
        .filter(file => file !== 'built-in.yaml' && file.endsWith('.yaml'))
        .map(async file => {
          const content = await fs.readFile(path.join(templatesDir, file), 'utf-8');
          return {
            name: file.replace('.yaml', ''),
            content
          };
        })
    );
    return NextResponse.json({
      builtIn: builtInTemplate,
      custom: customTemplates
    });
  } catch (error) {
    console.error("Error loading templates:", error);
    return NextResponse.json(
      { error: "Failed to load templates" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, content } = await request.json();

    if (!name || !content) {
      return NextResponse.json(
        { error: "Name and content are required" },
        { status: 400 }
      );
    }

    const templatesDir = path.join(process.cwd(), 'data/templates');
    const templatePath = path.join(templatesDir, `${name}.yaml`);

    await fs.writeFile(templatePath, content);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving template:", error);
    return NextResponse.json(
      { error: "Failed to save template" },
      { status: 500 }
    );
  }
}
