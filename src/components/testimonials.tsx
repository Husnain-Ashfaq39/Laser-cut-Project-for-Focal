const testimonials = [
  {
    testimonial:
      "Robbie and George are great to deal with, they are solutions focused deliver a good high level finish.",
    name: "Josh",
    company: "Triple Star",
  },
  {
    testimonial:
      "I used Focal for some interior metalwork. They done an awesome job. I would highly recommend Focal to anyone looking for quality metalwork.",
    name: "Malcom",
    company: "AJ Saville",
  },
  {
    testimonial:
      "The amazing team at FOCAL are true metal artisans who always deliver top-quality work. I can't praise their craftsmanship enough and I'll definitely be using them for all my future projects!",
    name: "Josh",
    company: "Compound",
  },
  {
    testimonial:
      "Been using FOCAL for sometime now, always meets my deadlines. No job is too big or small, friendly professional staff.",
    name: "Conrad",
    company: "Queenstown Signs",
  },
];

const Testimonials = () => {
  return (
    <div className="mx-auto flex w-[95%] max-w-7xl flex-col gap-8 py-8">
      <div className="space-y-5 pl-4 text-left">
        <h2 className="font-secondary text-3xl font-normal text-gray-400">
          Testimonials
        </h2>
        <h1 className="font-cinzel text-6xl">
          BUILDING <span className="font-bold">TRUST</span>
        </h1>
      </div>
      <div className="flex">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="w-full flex-col items-start justify-start py-[5vw] sm:w-[30%]"
          >
            <div className="flex w-[90%] flex-col space-y-2">
              <p className="mb-2 text-start font-secondary text-lg font-normal">
                {testimonial.testimonial}
              </p>

              <p className="py-2 font-secondary font-semibold">
                {testimonial.name}
              </p>
              <p className="font-secondary">{testimonial.company}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
