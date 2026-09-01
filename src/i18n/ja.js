const ja = {
  // Nav
  nav: {
    overview: '概要',
    research: '研究',
    contact: '連絡',
  },

  // Hero
  hero: {
    name: '大塚 匠',
    statement: 'アイデンティティ、暗号、検証可能な知能システムを研究しています。',
    description: '早稲田大学大学院で研究を行い、AIFTでAIセキュリティのリサーチインターンを務めています。現在の研究テーマは、量子計算機に対して安全な匿名クレデンシャルと、AIシステムのセキュリティ評価手法です。',
    cta_primary: '主な研究',
    cta_secondary: '連絡先',
  },

  // Sections
  sections: {
    research: '主な研究',
    active_research: '進行中の研究',
    philosophy: '経歴',
  },

  // Thesis
  thesis: {
    label: '修士論文',
    title: 'ポスト量子匿名クレデンシャル',
    status: '進行中',
    description: 'ポスト量子匿名クレデンシャルシステムにおけるzkVMとSNARK回路コンパイラの比較分析。BDECは静的なzkSNARK回路に依存するため、動的な属性管理に制約があります。本研究では両アプローチでBDEC検証器をベンチマークし、証明時間・検証時間・メモリ使用量を測定します。',
    focus: 'zkVM vs SNARKコンパイラ',
    protocol: 'Loquat / BDEC',
    application: '動的属性管理',
  },

  // OntoVC
  vcldac: {
    label: '副研究',
    title: 'OntoVC',
    status: '進行中',
    description: 'Linked Data検証可能クレデンシャルを拡張し、プライバシーを保護するマルチ発行者オントロジー推論を実現します。保有者は中間前提を明かすことなく、複数の独立したクレデンシャルから導出された事実を証明できます。SNARKと匿名クレデンシャルを結合する二層検証アーキテクチャを持ち、LEAN 4による完全な形式検証を備えています。',
    focus: 'ZKオントロジー推論',
    architecture: '二層 SNARK + AC',
    verification: 'LEAN 4 + Rust',
  },

  // Background
  philosophy: {
    p1: '私の研究は暗号理論、AI、システム工学の交差点に位置し、理論的な困難性の仮定と実用的でユーザー中心のアプリケーションの橋渡しを目指しています。',
    p2: '学術的な歩みは、ニューラルネットワークの精度保証付き数値計算から、暗号プロトコルの形式的解析へと移ってきました。同じ厳密性を、現在は暗号学的困難性とAIシステムのセキュリティ評価に適用しています。',
    stack_label: '使用言語・ツール',
  },

  // Contact
  contact: {
    title: '連絡先',
    subtitle: '暗号、アイデンティティ、AIセキュリティに関する共同研究や対話を歓迎します。',
    form: {
      name: '名前',
      email: 'メール',
      message: 'メッセージ',
      send: '送信',
      sending: '送信中…',
      sent: '送信しました。',
      error: '送信できませんでした。直接メールでご連絡ください。',
    },
    cv_link: '履歴書',
  },

  // Footer
  footer: {
    copyright: '大塚 匠',
    search_hint: '検索',
  },

  // Project cards
  project: {
    view: '研究を見る',
    also: 'その他の制作',
  },

  // Common
  focus_area: '焦点',
  key_protocol: 'プロトコル',
  application: 'アプリケーション',
  architecture: 'アーキテクチャ',
  verification: '検証',
  tech_stack: 'ツール・手法',
  problem: 'この問題が重要な理由',
  approach: 'アプローチ',
  outcomes: '主要な結果',
  technical_details: '技術的詳細',
  artifacts: '成果物',
  return_home: 'ホームに戻る',
  back_to_projects: '一覧に戻る',
  source_code: 'ソースコード',
  research_paper: '論文',
};

export default ja;
