import { NextRequest, NextResponse } from 'next/server';
import { VAZI_SYSTEM_PROMPT } from '@/lib/system-prompt';

export async function POST(req: NextRequest) {
  try {
    const { messages, mode, taskList } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid payload: messages array is required.' },
        { status: 400 }
      );
    }

    const currentPrompt = messages[messages.length - 1]?.content || '';

    let constructedPrompt = currentPrompt;

    if (mode === 'orchestrate') {
      constructedPrompt = `[ORCHESTRATOR MODE ACTIVE] Evaluate path vectors for task distribution. Break this instruction down to sub-agents (Zey AI, Xye AI, Try Prompt AI, Zey Vault, Zey Labs). Input: "${currentPrompt}"`;
    } else if (mode === 'task') {
      constructedPrompt = `[TASK ASSISTANT MODE ACTIVE] Parse the following request for task items, schedule maps, and limits. Input: "${currentPrompt}". Current Context state: ${JSON.stringify(taskList)}`;
    }

    // Live Gateway Handshake Isolation
    const response = await fetch('https://zey-ai.vercel.app/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ZEY_AI_API_KEY || ''
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: VAZI_SYSTEM_PROMPT },
          { role: 'user', content: constructedPrompt }
        ],
        stream: false
      })
    });

    // Error Handling: Gateway Down Validation
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { 
          success: false, 
          error: `Gateway Error Node Failure (${response.status}): ${errorText || 'Upstream validation failed.'}` 
        }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Fallback extraction handling for strict content payloads
    const content = data.choices?.[0]?.message?.content || data.content || JSON.stringify(data);

    return NextResponse.json({ success: true, content });

  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        error: `Critical Infrastructure Pipeline Interruption: ${error.message}` 
      }, 
      { status: 500 }
    );
  }
}
