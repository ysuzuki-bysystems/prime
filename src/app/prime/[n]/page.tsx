export const dynamic = "force-static";
export const revalidate = 0;

function isPrime(n: bigint): boolean {
  if (n === 1n) {
    return false;
  }

  if (n === 2n) {
    return true;
  }

  for (let i = 2n; i < n; i++) {
    if (n % i === 0n) {
      return false;
    }
  }

  return true;
}

function nthPrime(n: bigint): bigint {
  let found: bigint = 0n;
  let last: bigint = 1n;

  for (;;) {
    if (isPrime(last)) {
      found++;
    }
    if (found >= n) {
      break;
    }
    last++;
  }

  return last;
}

export default function Prime({ params }: { params: { n: string }}) {
  let val: bigint;
  try {
    val = BigInt(params.n);
  } catch (e) {
    return (<>Bad Number ${params.n}</>);
  }

  return (<>{params.n}つ目の素数は{nthPrime(val).toString()}です。</>);
}
