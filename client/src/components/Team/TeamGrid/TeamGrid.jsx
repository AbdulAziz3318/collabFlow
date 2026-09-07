import "./TeamGrid.css";

import MemberCard from "../MemberCard/MemberCard";

const TeamGrid = ({ members }) => {
  return (
    <div className="team-grid">

      {members.map((member) => (
        <MemberCard
          key={member.id}
          member={member}
        />
      ))}

    </div>
  );
};

export default TeamGrid;