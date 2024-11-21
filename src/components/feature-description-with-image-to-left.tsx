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
        <img src={img} alt="placeholder" className="relative flex w-2/5 overflow-hidden rounded-lg border object-cover h-[650px]" />
      <div className="flex w-3/5 flex-col items-start gap-6 py-8 pl-12">
        <h1 className="font-cinzel text-5xl font-bold">{title}</h1>
        <p className="pr-10 font-secondary text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default FeatureDescriptionWithImageToLeft;
