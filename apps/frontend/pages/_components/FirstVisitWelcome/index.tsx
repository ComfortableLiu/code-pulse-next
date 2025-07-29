import { CSSProperties, memo } from "react";

const FirstVisitWelcome = ({ style }: { style?: CSSProperties }) => {
  return (
    <div
      className="container"
      style={style}
    >
      <h1>欢迎来到Code Pulse！</h1>
      <p>
        本站致力于为广大开发者提供一系列实用的小工具，帮助大家提升开发效率、简化日常工作流程。我们专注于每一个细节，力求功能的完整性与健壮性，以满足多样化的开发需求。</p>
      <p>我们诚挚邀请您在使用过程中积极反馈问题、提出建议，与我们共同打造一个更强大、更稳定的开发者工具平台！</p>
    </div>
  )
}

export default memo(FirstVisitWelcome)
