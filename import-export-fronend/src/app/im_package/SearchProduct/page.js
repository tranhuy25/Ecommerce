import Link from 'next/link';
import Inventory from './Inventory';
import Nav_bar from '@/app/components/Nav/Nav_bar';
export default function SearchProductPage() {
    return (
      <>
      <Nav_bar />
      <div className="pt-16">
        <Inventory />
      </div>
      </>
    );
  }