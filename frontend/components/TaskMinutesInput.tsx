/** CR-022: the estimated-minutes input of a task row, with the unit "분" shown next to it. */
export function TaskMinutesInput({ value, onChange }: { value: number; onChange: (minutes: number) => void }) {
  return (
    <div className="minutes-field">
      <input
        type="number"
        min={1}
        max={6000}
        value={Number.isFinite(value) ? value : ""}
        onChange={(e) => onChange(e.target.value === "" ? Number.NaN : Number(e.target.value))}
        aria-label="예상 학습 시간(분)"
      />
      <span className="minutes-unit" aria-hidden="true">
        분
      </span>
    </div>
  );
}
