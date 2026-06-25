export interface OcrResponse {
  storeName: string;
  amount: number;
  purchasedAt: string;
  category: string;
}

/**
 * Mock OCR Service
 * This is isolated so it can easily be swapped with Google Cloud Vision OCR 
 * or Gemini API (Vision) at a later date.
 * 
 * @param imageUri - The local URI or public URL of the uploaded receipt/screenshot image
 */
export async function processReceiptImage(imageUri: string): Promise<OcrResponse> {
  // Simulate network/processing latency of 1.2 seconds
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  const mockExpenses = [
    { storeName: '무신사 온라인 스토어', amount: 89000, category: '패션' },
    { storeName: '엽기떡볶이 서초점', amount: 26000, category: '식비' },
    { storeName: '블루보틀 삼청동', amount: 6500, category: '카페' },
    { storeName: '카카오T 택시', amount: 14800, category: '교통' },
    { storeName: '넷플릭스 월간구독', amount: 17000, category: '정기구독' },
    { storeName: '시코르 강남점', amount: 32000, category: '뷰티' },
    { storeName: '다이소 강남역점', amount: 4500, category: '기타' }
  ];
  
  const randomIndex = Math.floor(Math.random() * mockExpenses.length);
  const selected = mockExpenses[randomIndex];
  
  return {
    storeName: selected.storeName,
    amount: selected.amount,
    purchasedAt: new Date().toISOString(),
    category: selected.category,
  };
}
