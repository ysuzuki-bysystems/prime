export default function Home() {
  const numbers = [
    1,
    2,
    2000,
    5000,
  ];

  return (
    <main>
      <ul>
        {numbers.map(n => <li key={n}><a href={`/prime/${n}`}>{n}つ目の素数を表示</a></li>)}
      </ul>
    </main>
  )
}
