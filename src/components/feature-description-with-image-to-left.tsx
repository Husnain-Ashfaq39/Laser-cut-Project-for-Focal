interface FeatureDescriptionFeature {
  title: string;
  description: React.ReactNode;
  img: any;
}

const FeatureDescriptionWithImageToLeft = ({
  title,
  description,
  img,
}: FeatureDescriptionFeature) => {
  return (
    <div className="flex w-full flex-row items-center justify-between">
      <div className="relative flex w-2/5 overflow-hidden rounded-lg border">
        <img src={img} alt="placeholder" className="object-cover h-[650px] w-[600px]" />
      </div>
      <div className="flex w-3/5 flex-col items-start gap-6 py-8 pl-12">
        <h1 className="font-cinzel text-5xl font-bold">{title}</h1>
        <p className="pr-10 font-secondary text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default FeatureDescriptionWithImageToLeft;
