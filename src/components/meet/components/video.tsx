import { getGridClass } from "../../../lib/helper";
import type { Participant } from "../../../types/types";

export default function VideoGrid() {
  // Mock participants (UI only)
  const participants: Participant[] = Array.from(
    { length: 5 },
    (_, i) => ({
      id: String(i),
      name: `User ${i + 1}`,
    })
  );

  return (
   <div className="flex-1 p-4 h-[calc(100vh-(4rem+3.5rem))]">
      <div
        className={`
          grid gap-4 h-full
          ${getGridClass(participants.length)}
          place-items-center
        `}
      >
        {participants.map((p) => (
          <div
            key={p.id}
            className="w-full h-full bg-black rounded-lg flex items-center justify-center text-white"
          >
            {p.name}
          </div>
        ))}
      </div>
    </div>
  );
}