interface ProductSaleBadgeProps {
  originalPrice: number;
  salePrice: number;
  className?: string;
}

const ProductSaleBadge = ({ originalPrice, salePrice, className = '' }: ProductSaleBadgeProps) => {
  const discountPercent = Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  
  if (discountPercent <= 0) return null;

  return (
    <div className={`absolute top-2 left-2 z-10 ${className}`}>
      <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
        -{discountPercent}%
      </span>
    </div>
  );
};

export default ProductSaleBadge;