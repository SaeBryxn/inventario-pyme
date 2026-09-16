// Skeletons de carga. <SkeletonTable> imita una tabla mientras llegan los datos.
export function Skeleton({ w = '100%', h = 16, r = 6, style }) {
  return <span className="skeleton" style={{ width: w, height: h, borderRadius: r, ...style }} />;
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>{Array.from({ length: cols }).map((_, i) => <th key={i}><Skeleton w="60%" h={10} /></th>)}</tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>
              {Array.from({ length: cols }).map((_, c) => <td key={c}><Skeleton w={c === 0 ? '50%' : '75%'} /></td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SkeletonCards({ n = 4 }) {
  return (
    <div className="cards">
      {Array.from({ length: n }).map((_, i) => (
        <div className="card stat" key={i}>
          <Skeleton w="40%" h={28} />
          <Skeleton w="70%" h={12} />
        </div>
      ))}
    </div>
  );
}
