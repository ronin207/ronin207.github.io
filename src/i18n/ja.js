const ja = {
  // Nav
  nav: {
    overview: '概要',
    research: '研究',
    contact: '連絡',
  },

  // Hero
  hero: {
    badge: 'AIセキュリティ研究 @ AIFT · 修士 @ 早稲田大学',
    title_1: '最適化する',
    title_2: '量子の未来',
    description: '早稲田大学とAIFTで**AIセキュリティ**、**ポスト量子暗号**、**ゼロ知識証明**を研究。量子時代にも安全な暗号システムの構築を目指す。',
    cta_primary: 'プロトコルを見る',
    cta_secondary: './連絡する',
  },

  // Sections
  sections: {
    research: '研究領域',
    interests: '学際的関心',
    active_research: '進行中の研究',
    philosophy: '哲学',
  },

  // Intersection Interests
  interests: {
    p1: '私の研究は**暗号理論**、**AI**、**システム工学**の交差点に位置しています。理論的な困難性の仮定と実用的でユーザー中心のアプリケーションの橋渡しを目指しています。',
    p2: 'これらの分野を組み合わせることで、現代のAIが暗号解析のツールとなると同時に、ゼロ知識証明やFHEなどのプライバシー保護技術の恩恵を受ける方法を探求しています。',
  },

  // Thesis
  thesis: {
    label: '修士論文',
    title: 'ポスト量子匿名認証',
    status: '進行中',
    description: 'ポスト量子匿名認証システムにおけるzkVMとSNARK回路コンパイラの比較分析。BDECの静的なzkSNARK回路への依存は、動的な属性管理における致命的な柔軟性の欠如をもたらします。本研究では、zkVMと回路コンパイラの両アプローチでBDEC検証器をベンチマークし、証明時間、検証時間、メモリ使用量を測定して、次世代デジタルアイデンティティシステムのより実行可能な基盤を決定します。',
    focus: 'zkVM vs SNARK コンパイラ',
    protocol: 'Loquat / BDEC',
    application: '動的属性管理',
  },

  // OntoVC
  vcldac: {
    label: '副研究',
    title: 'OntoVC',
    status: '進行中',
    description: 'Linked Dataの検証可能な資格情報を拡張し、プライバシーを保護するマルチ発行者オントロジー推論を実現。保有者はドメイン固有のオントロジーを使用して、中間前提を明かすことなく、複数の独立した資格情報から導出された事実を証明できます。SNARKと匿名認証システムを結合する二層検証アーキテクチャを特徴とし、LEAN 4による完全な形式検証を備えています。',
    focus: 'ZKオントロジー推論',
    architecture: '二層 SNARK + AC',
    verification: 'LEAN 4 + Rust',
  },

  // Philosophy
  philosophy: {
    transition_label: '転換',
    transition: '私の学術的な道は、ニューラルネットワークの数値最適化から暗号プロトコルの安全性を保証する数学的厳密性の形式化へと進化してきました。厳密な検証の強固なバックグラウンドを持ちながら、現在の厳密性は**暗号的困難性**と**数値最適化**に適用されています。',
    belief: '量子コンピューティングが成熟するにつれて、セキュリティの美学は「見える南京錠」から「見えない数学」へと移行すると信じています。ポスト量子の世界でも安全であり続けるシステムの構築を目指しています。',
    stack_label: '研究スタック',
  },

  // Contact
  contact: {
    title: '通信開始',
    subtitle: '学術的な共同研究、研究アシスタント職、興味深い対話に開かれています。',
    form: {
      name: '名前',
      email: 'メール',
      message: 'メッセージ',
      send: 'メッセージを送信',
      sending: '送信中...',
      sent: '送信完了！',
      error: '問題が発生しました。直接メールでお試しください。',
    },
    cv_link: '履歴書を見る',
  },

  // Footer
  footer: {
    copyright: 'TAKUMI.DEV',
    system: 'システム',
    terminal: 'ターミナル',
    search: '検索',
  },

  // Project cards
  project: {
    view: 'プロジェクトを見る',
  },

  // Common
  focus_area: '研究領域',
  key_protocol: '主要プロトコル',
  application: 'アプリケーション',
  architecture: 'アーキテクチャ',
  verification: '検証',
  tech_stack: '技術スタック',
  problem: '課題',
  approach: '技術的アプローチ',
  outcomes: '主要成果',
  return_home: 'ホームに戻る',
  back_to_projects: 'プロジェクト一覧に戻る',
  source_code: 'ソースコード',
  research_paper: '研究論文',
};

export default ja;
