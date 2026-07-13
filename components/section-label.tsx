type SectionLabelProps = {
  no: string;
  children: React.ReactNode;
};

export function SectionLabel({ no, children }: SectionLabelProps) {
  return (
    <div className="seclabel">
      <span className="no">{no}</span> {children}
    </div>
  );
}
