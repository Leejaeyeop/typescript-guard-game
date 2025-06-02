export interface Quiz {
  id: number; // 문제 고유 ID
  question: string; // 문맥을 제공하는 질문 (예: "하늘은 파란가?")
  answer: string; // 사용자가 True/False로 판단할 실제 문장 (예: "하늘은 빨갛다.")
  correctAnswer: boolean; // 위 "answer" 필드 문장의 실제 참/거짓 값
}
