const CustomLegend = (props) => {
  const { payload } = props;

  return (
    <div className="custom-legend" style={{ textAlign: 'left', display: 'flex', flexDirection: 'row', gap: '12px', flexWrap: 'wrap', margin: '16px 16px 16px 32px'}}>
      {payload.map((entry, index) => (
        <div key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
          <div style={{ width: '12px', height: '12px',borderRadius: '6px' ,backgroundColor: entry.color, marginRight: '4px' }}></div>
          <span style={{fontSize: "14px", fontWeight: 600} }>{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default CustomLegend;