export function Card({
  className,
  imageClassName,
  src,
  alt,
  name,
  
}: {
  className?: string;
  imageClassName?: string;
  src: string;
  name:string
  alt:string;
}): JSX.Element {
  return (
    <div className={`p-8 pb-4  flex flex-col justify-center items-center rounded-lg ${className}`}>
        <img src={src} className={`overflow-hidden  shadow-lg  w-[100px] h-[100px] rounded-full ${imageClassName}`} alt={alt} />
        <p className="m-2 text-gray-500">{name}</p>
    </div>
  );
}


// href={`${href}?utm_source=create-turbo&utm_medium=basic&utm_campaign=create-turbo"`}  children: React.ReactNode;