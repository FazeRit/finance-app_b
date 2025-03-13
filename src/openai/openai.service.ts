import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
  private ai: OpenAI;

  constructor(private config: ConfigService) {
    this.ai = new OpenAI({
      apiKey: this.config.getOrThrow('OPENAI_API_KEY'),
      baseURL: 'https://models.inference.ai.azure.com',
    });
  }

  async chat(prompt: string, model = 'o3-mini', jsonResponse = true) {
    try {
      const completion = await this.ai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model,
        response_format: jsonResponse ? { type: 'json_object' } : undefined,
      });

      const responseContent = completion.choices[0].message.content;
      return jsonResponse ? JSON.parse(responseContent) : responseContent;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to chat with the AI');
    }
  }

  async extractExpensesFromText(text: string): Promise<any[]> {
    const prompt = `
      You are an expert in parsing bank statements. Below is the text extracted from a bank statement PDF. Your task is to identify and extract all expense transactions and return them as a JSON array. Each expense should have the following fields:
      - amount: number (positive value, representing the expense amount)
      - categoryId: number | null (optional; assign a default value like 1 for "Food", 2 for "Utilities", etc., if identifiable, otherwise omit or set to null)
      - description: string (a brief description of the transaction)
      - date: string (ISO 8601 format, e.g., "2023-10-15T12:00:00Z"; infer from the statement if possible, otherwise use today's date: "2025-03-13T00:00:00Z")

      Here is the extracted text from the bank statement:
      "${text}"

      Return the result as a flat JSON array (do not wrap it in an object like {"transactions": []}), use only result: [] for wrapping them.:
      [
        { "amount": 50.75, "categoryId": 1, "description": "Lunch with friends", "date": "2023-10-15T12:00:00Z" },
        { "amount": 20.00, "categoryId": null, "description": "Miscellaneous payment", "date": "2023-10-15T12:00:00Z" }
      ]

      If no expense transactions are found in the text, return an empty array: []
    `;

    const expenses = await this.chat(prompt);

    return expenses.result;
  }
}
