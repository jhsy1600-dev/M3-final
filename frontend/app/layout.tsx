import type { Metadata } from "next";
import "./globals.css";

import { AuthProvider } from "@/components/AuthProvider";
import { WakeNotice } from "@/components/WakeNotice";
import { ServerGate } from "@/components/ServerGate";

export const metadata: Metadata = {
  title: "PaceMate",
  description: "목표 설정과 학습 계획부터 실행 기록, 회고, 검토된 참고자료, AI 튜터까지. PaceMate는 독학 학습자의 처음부터 끝까지를 함께하는 AI 학습 파트너입니다.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <ServerGate>
          <AuthProvider>{children}</AuthProvider>
          <WakeNotice />
        </ServerGate>
      </body>
    </html>
  );
}
