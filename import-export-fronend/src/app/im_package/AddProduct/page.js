import Link from 'next/link';
import AddProductForm from './AddProductForm';
import Nav_bar from '@/app/components/Nav/Nav_bar';
export default function AddProductPage() {
    return (
      <>
    <Nav_bar />
      <div className="pt-16">
        <AddProductForm />
      </div>
      </>
    );
  }