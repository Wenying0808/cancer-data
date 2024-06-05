const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      // Sort the payload data by value
      const sortedPayload = payload.sort((a, b) => b.value - a.value);
  
      return (
        <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '8px', boxShadow: "0px 2px 20px 0px rgba(0, 0, 0, 0.35)" }}>
          <div style={{marginBottom: '8px'}}>{`Year: ${sortedPayload[0].payload.year}`}</div>
          {sortedPayload.map((entry, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '6px', backgroundColor: entry.color, marginRight: '6px' }}></div>
              <div>{`${entry.name}: ${entry.value}`}</div>
            </div>
          ))}
        </div>
      );
    }
  
    return null;
  };

  export default CustomTooltip;