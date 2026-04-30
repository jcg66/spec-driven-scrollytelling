type VisualizationFrameProps = {
  label: string;
  description: string;
};

export function VisualizationFrame({ label, description }: VisualizationFrameProps) {
  return (
    <section className="visualizationFrame" aria-label={label}>
      <p className="visualizationLabel">{label}</p>
      <p className="visualizationDescription">{description}</p>
    </section>
  );
}
