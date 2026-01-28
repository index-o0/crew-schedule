export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">서비스 이용약관</h1>

        <div className="bg-white rounded-xl p-6 space-y-6 text-slate-600">
          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">1. 서비스 소개</h2>
            <p>걸뱅이크루 일정 관리는 그룹 모임 일정을 조율하기 위한 투표 서비스입니다.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">2. 서비스 이용</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>서비스 이용을 위해 Google 계정으로 로그인이 필요합니다.</li>
              <li>일정 생성 및 투표 기능을 무료로 이용할 수 있습니다.</li>
              <li>생성된 일정은 링크를 통해 다른 사람과 공유할 수 있습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">3. 데이터 저장</h2>
            <p>모든 일정 및 투표 데이터는 클라우드 서버(Supabase)에 저장됩니다. 이를 통해 링크를 공유받은 누구나 동일한 일정에 접근하여 투표할 수 있습니다.</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>일정 생성자는 언제든지 일정을 삭제할 수 있습니다.</li>
              <li>일정 삭제 시 관련 투표 데이터도 함께 삭제됩니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">4. 면책 조항</h2>
            <p>본 서비스는 개인 프로젝트로 운영되며, 서비스 중단이나 데이터 손실에 대한 책임을 지지 않습니다.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">5. 약관 변경</h2>
            <p>서비스 약관은 필요에 따라 변경될 수 있으며, 변경 시 서비스 내 공지합니다.</p>
          </section>

          <p className="text-sm text-slate-400 pt-4 border-t">
            최종 수정일: 2026년 1월 29일
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
