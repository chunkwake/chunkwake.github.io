'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { featureMatrix } from '@/lib/feature-matrix';

export function MatrixTotals() {
  const pathname = usePathname();
  const isEn = pathname?.startsWith('/en') ?? false;
  const totals = featureMatrix.totals;

  if (isEn) {
    return (
      <p>
        According to the project&apos;s feature matrix: <strong>{totals.ready}</strong> mechanic families
        ready, <strong>{totals.partial}</strong> partial, <strong>{totals.missing}</strong> not started.
        The exact line-by-line status is on the{' '}
        <Link href="/en/docs/feature-matrix">feature matrix page</Link>.
      </p>
    );
  }

  return (
    <p>
      По фич-матрице проекта: <strong>{totals.ready}</strong> семейств механик готово,{' '}
      <strong>{totals.partial}</strong> частично, <strong>{totals.missing}</strong> не начато. Построчные
      статусы — на <Link href="/ru/docs/feature-matrix">странице фич-матрицы</Link>.
    </p>
  );
}
