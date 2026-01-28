export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">개인정보처리방침</h1>

        <div className="bg-white rounded-xl p-6 space-y-6 text-slate-600">
          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">1. 수집하는 개인정보</h2>
            <p>걸뱅이크루 일정 관리 서비스는 Google 로그인을 통해 다음 정보를 수집합니다:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>이름</li>
              <li>이메일 주소</li>
              <li>프로필 사진</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">2. 개인정보의 이용 목적</h2>
            <p>수집된 정보는 다음 목적으로만 사용됩니다:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>사용자 식별 및 로그인 처리</li>
              <li>일정 투표 시 참여자 표시</li>
              <li>중복 투표 방지</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">3. 개인정보의 보관</h2>
            <p>모든 데이터는 사용자의 브라우저 로컬 스토리지에 저장되며, 별도의 서버에 저장되지 않습니다.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">4. 개인정보의 제3자 제공</h2>
            <p>수집된 개인정보는 제3자에게 제공되지 않습니다.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">5. 문의</h2>
            <p>개인정보 관련 문의사항이 있으시면 서비스 관리자에게 연락해주세요.</p>
          </section>

          <p className="text-sm text-slate-400 pt-4 border-t">
            최종 수정일: 2026년 1월 28일
          </p>
        </div>

        <div className="mt-6 text-center">
          <a href="/" className="text-indigo-600 hover:text-indigo-800 text-sm">
            ← 메인으로 돌아가기
          </a>
        </div>
      </div>
    </div>
  );
}
