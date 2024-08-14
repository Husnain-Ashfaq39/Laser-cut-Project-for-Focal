// Single Blog Background Image
import BLog1BackgroundImage from "@/assets/blogs-images/single-blog-img/img-1.png";
import BLog2BackgroundImage from "@/assets/blogs-images/single-blog-img/img-2.png";
import BLog3BackgroundImage from "@/assets/blogs-images/single-blog-img/img-3.png";
import BLog4BackgroundImage from "@/assets/blogs-images/single-blog-img/img-4.png";
import BLog5BackgroundImage from "@/assets/blogs-images/single-blog-img/img-5.png";
import BLog6BackgroundImage from "@/assets/blogs-images/single-blog-img/img-6.png";

// blog1 content images
import Blog1Image1 from "@/assets/blogs-images/single-blog-img/blog1/img-7.png";
import Blog1Image2 from "@/assets/blogs-images/single-blog-img/blog1/img-8.png";
import Blog1Image3 from "@/assets/blogs-images/single-blog-img/blog1/img-9.png";
import Blog1Image4 from "@/assets/blogs-images/single-blog-img/blog1/img-10.png";
import Blog1Image5 from "@/assets/blogs-images/single-blog-img/blog1/img-11.png";
import Blog1Image6 from "@/assets/blogs-images/single-blog-img/blog1/img-12.png";

// blog2 content images
import Blog2Image1 from "@/assets/blogs-images/single-blog-img/blog2/img-1.jpeg";
import Blog2Image2 from "@/assets/blogs-images/single-blog-img/blog2/img-2.jpeg";
import Blog2Image3 from "@/assets/blogs-images/single-blog-img/blog2/img-3.jpeg";
import Blog2Image4 from "@/assets/blogs-images/single-blog-img/blog2/img-4.jpeg";
import Blog2Image5 from "@/assets/blogs-images/single-blog-img/blog2/img-5.jpeg";
import Blog2Image6 from "@/assets/blogs-images/single-blog-img/blog2/img-6.jpeg";
import Blog2Image7 from "@/assets/blogs-images/single-blog-img/blog2/img-7.jpeg";
import Blog2Image8 from "@/assets/blogs-images/single-blog-img/blog2/img-8.jpeg";
import Blog2Image9 from "@/assets/blogs-images/single-blog-img/blog2/img-9.jpeg";

// blog3 content images
import Blog3Image1 from "@/assets/blogs-images/single-blog-img/blog3/img-1.jpeg";
import Blog3Image2 from "@/assets/blogs-images/single-blog-img/blog3/img-2.jpeg";
import Blog3Image3 from "@/assets/blogs-images/single-blog-img/blog3/img-3.jpeg";

// blog4 content images
import Blog4Image1 from "@/assets/blogs-images/single-blog-img/blog4/img-1.jpeg";
import Blog4Image2 from "@/assets/blogs-images/single-blog-img/blog4/img-2.jpeg";

// blog5 content images
import Blog5Image1 from "@/assets/blogs-images/single-blog-img/blog5/img-1.jpeg";
import Blog5Image2 from "@/assets/blogs-images/single-blog-img/blog5/img-2.jpeg";
import Blog5Image3 from "@/assets/blogs-images/single-blog-img/blog5/img-3.jpeg";

// blog6 content images
import Blog6Image1 from "@/assets/blogs-images/single-blog-img/blog6/img-1.jpeg";
import Blog6Image2 from "@/assets/blogs-images/single-blog-img/blog6/img-2.jpeg";
import Blog6Image3 from "@/assets/blogs-images/single-blog-img/blog6/img-3.jpeg";
import Blog6Image4 from "@/assets/blogs-images/single-blog-img/blog6/img-4.jpeg";
import Blog6Image5 from "@/assets/blogs-images/single-blog-img/blog6/img-5.jpeg";
import Blog6Image6 from "@/assets/blogs-images/single-blog-img/blog6/img-6.jpeg";


export const blogsContent = [
  {
    id: 1,
    backgroundImage: BLog1BackgroundImage,
    title: "Luxury metal fabrication on high end architectural homes.",
    description:
      "Focal recently had the pleasure of working on a beautiful high-end architectural project in Queenstown. Have a read to find out about the project and see images.",
    author: "George Hayden",
    readTime: "2 min",
    views: "1.2k",
    shares: "1.2k",
    content: (
      <>
        <div className="m-auto my-6 w-[70%] space-y-6 px-[6%] font-body">
          <p className="text-lg text-gray-800">
            Focal recently had the pleasure of working on a beautiful high-end
            architectural project in Queenstown.
          </p>
          <img
            src={Blog1Image1}
            className="h-[500px] w-full rounded-lg object-cover shadow-lg"
            alt="Project Image 1"
          />
          <p className="mt-4 text-xl font-semibold text-gray-900">
            Aged brass handrail with LED
          </p>
          <p className="text-lg text-gray-800">
            The project was beautifully designed by Elena Parry at{" "}
            <a
              href="https://www.fremontstudio.co.nz/"
              className="text-blue-600 hover:underline"
            >
              Fremont Studio
            </a>{" "}
            and we here at Focal love the result with what she has designed.
            Elena trusted us by allowing the artistic freedom to fabricate and
            design as we saw fit to achieve her overall vision. We are very
            fortunate to work closely with other skilled craftsmen who are at
            the top of their game in their own respective fields.{" "}
            <a
              href="https://www.wedgerwood.co.nz/"
              className="text-blue-600 hover:underline"
            >
              Wedgerwood
            </a>{" "}
            is a local joinery company who we continue to work with on multiple
            projects, making these challenging projects easier to execute.
            Focal’s scope for the project was the decorative metalwork elements
            of the build. This included a bespoke antique brass handrail with
            undermount LED strip lighting, antique brass door handles, antique
            brass beam covers, brass inlay to the bar counter, brass shelving
            rods for the bar, a cold-rolled steel woodstore inset into
            Wedgerwood’s joinery unit, and a hot-rolled steel woodstore for the
            garage.
          </p>
          <img
            src={Blog1Image2}
            className="h-[500px] w-full rounded-lg object-cover shadow-lg"
            alt="Project Image 2"
          />
          <p className="mt-4 text-xl font-semibold text-gray-900">
            Antique brass handrail with LED
          </p>
          <p className="text-lg text-gray-800">
            Working with brass is always a challenge, but the results truly
            speak for themselves. The LED handrails are something that we get
            asked to provide more often, and we have come up with a great system
            to supply these. They are not exactly straightforward and are
            technical to execute. We need to have a machined rebate throughout
            the whole length of the handrail for the LED and diffuser to sit
            into, and have one of the handrail brackets hollow to allow wiring
            to be truly hidden. The result is worth it.
          </p>
          <img
            src={Blog1Image3}
            className="h-[500px] w-full rounded-lg object-cover shadow-lg"
            alt="Brass handrail with LED"
          />
          <p className="mt-4 text-xl font-semibold text-gray-900">
            Brass handrail with rebate for LED
          </p>
          <p className="text-lg text-gray-800">
            Thanks to our friends at{" "}
            <a
              href="https://www.ambrometals.com/"
              className="text-blue-600 hover:underline"
            >
              Ambro Metals
            </a>
            , we are able to source large brass sheets that are 3000mm long. For
            the beam covers, these worked perfectly and meant that we did not
            have to have any joins throughout the length. These were cut to size
            on our CNC profile cutting machine and folded to precision with our
            CNC press brake, which made light work of the brass.
          </p>
          <p className="mt-4 text-xl font-semibold text-gray-900">
            Antique brass beam covers
          </p>
          <p className="text-lg text-gray-800">
            All elements of the projects utilized different specialty metal
            finishing. All the brass was antique finished after the welding and
            brazing were metal finished and polished. They were then sealed with
            beeswax. The steel was kept scratch and blemish-free for the whole
            fabrication process with weld size and locations worked in smartly
            to hide as much as possible, and then sealed with beeswax.
          </p>
          <img
            src={Blog1Image4}
            className="h-[500px] w-full rounded-lg object-cover shadow-lg"
            alt="Brass pull handles"
          />
          <p className="mt-4 text-xl font-semibold text-gray-900">
            Brass pull handles
          </p>
          <p className="text-lg text-gray-800">
            As with most of our projects, we install what we make and ensure
            that what we make fits our site measurements and is installed to the
            quality that we expect.
          </p>
          <img
            src={Blog1Image5}
            className="h-[500px] w-full rounded-lg object-cover shadow-lg"
            alt="Aged brass shelf rods"
          />
          <p className="mt-4 text-xl font-semibold text-gray-900">
            Aged brass shelf rods
          </p>
          <p className="text-lg text-gray-800">
            We are able to supply and freight items around New Zealand and
            beyond within reason.
          </p>
          <img
            src={Blog1Image6}
            className="h-[500px] w-full rounded-lg object-cover shadow-lg"
            alt="Brass bar inlay"
          />
          <p className="mt-4 text-xl font-semibold text-gray-900">
            Brass bar inlay
          </p>
          <p className="text-lg text-gray-800">
            Our attention to detail and dedication to quality craftsmanship is
            evident in every aspect of this project. We take pride in our
            ability to deliver exceptional results that meet and exceed our
            clients' expectations.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 2,
    backgroundImage: BLog2BackgroundImage,
    title: "Patagonia- high end commercial shop fit-out.",
    description:
      "A write up on a recently completed shop fit-out for Patagonia clothing company.",
    author: "George Hayden",
    readTime: "2 min",
    views: "1.2k",
    shares: "1.2k",
    content: (
      <>
        <div className="m-auto my-6 w-[70%] space-y-6 px-[6%] font-body">
          <p className="text-lg text-gray-800">
            As a company, being awarded the decorative metalwork contract as a
            part of the new{" "}
            <a
              href="https://www.patagonia.co.nz/"
              className="text-blue-600 hover:underline"
            >
              Patagonia
            </a>{" "}
            clothing store fit-out in Queenstown is one of the highlights.
          </p>
          <p className="text-lg text-gray-800">
            Patagonia’s commitment to quality and sustainability gels with us as
            a company as we strive to create great quality and enduring products
            while minimizing waste.
          </p>
          <p className="text-lg text-gray-800">
            While we generally work on luxury metal fabrication in high-end
            architectural homes, when the right commercial projects present
            themselves, we love to get involved.
          </p>
          <img
            src={Blog2Image1}
            className="h-[500px] w-full rounded-lg object-cover shadow-lg"
            alt="Hot-rolled steel shelf"
          />
          <p className="mt-4 text-xl font-semibold text-gray-900">
            Hot-rolled steel shelf
          </p>
          <p className="text-lg text-gray-800">
            The project was challenging for several reasons but one the Focal
            team stepped up for. We managed to get the project completed to a
            very high quality and this can be backed up with the fit-out
            achieving a gold award at the Master Build 2024 commercial project
            awards.
          </p>
          <p className="text-lg text-gray-800">
            <a
              href="https://ajsaville.co.nz/"
              className="text-blue-600 hover:underline"
            >
              A.J. Saville
            </a>{" "}
            were the head building contractor and we worked in closely with{" "}
            <a
              href="https://www.masterwood.co.nz/"
              className="text-blue-600 hover:underline"
            >
              Masterwood
            </a>{" "}
            who were awarded the joinery package.
          </p>
          <p className="text-lg text-gray-800">
            The overall brief was an overall rustic/industrial look using
            recycled products with a heavy element of metal work as a nod to
            Patagonia founder Yvon Chouinard’s early business days of
            blacksmithing creating climbing tools and accessories.
          </p>
          <img
            src={Blog2Image2}
            className="h-[500px] w-full rounded-lg object-cover shadow-lg"
            alt="Blackened pipe handrail"
          />
          <p className="mt-4 text-xl font-semibold text-gray-900">
            Blackened pipe handrail
          </p>
          <p className="text-lg text-gray-800">
            As a part of our package, we were required to supply a number of
            decorative elements. These included a bespoke bent pipe handrail,
            blackened hot-rolled steel counters, blackened steel room dividers,
            changing room mirrors and hanger brackets, a hot-rolled steel
            library shelf, door handles, picture frame brackets and the crux of
            the project- folded steel beam wraps.
          </p>
          <img
            src={Blog2Image3}
            className="h-[500px] w-full rounded-lg object-cover shadow-lg"
            alt="Rustic picture frames with blackened steel brackets"
          />
          <p className="mt-4 text-xl font-semibold text-gray-900">
            Rustic picture frames with blackened steel brackets
          </p>
          <p className="text-lg text-gray-800">
            The way that we were allowed to work on his project epitomizes what
            we love as a business. Given trust by the customer that we will
            produce the right result with artistic license to figure out the
            intricacies.
          </p>
          <p className="text-lg text-gray-800">
            Hot-rolled steel may look relatively simple; however, execution is
            key. To achieve a good result, your process from sourcing material
            from a supplier to installing this on site has to be completely
            on-point ensuring that there are no scratches or flaws. We put great
            thought into how this happens and how they are fabricated. Something
            as little as a heat mark from a TIG weld can catch your eye, so
            positioning of these and minimizing heat marks by way of welding
            skill is integral and what sets an average job apart from a great
            job.
          </p>
          <img
            src={Blog2Image4}
            className="h-[500px] w-full rounded-lg object-cover shadow-lg"
            alt="Hot-rolled steel clad joinery"
          />
          <p className="mt-4 text-xl font-semibold text-gray-900">
            Hot-rolled steel clad joinery
          </p>
          <p className="text-lg text-gray-800">
            The steel beam wraps were a huge undertaking with 18x of these units
            in total with multiple junctions. Originally, these concrete beams
            and columns were poured in situ during construction and as soon as a
            tape measure was run over these, we knew that we were in for a
            challenging job.
          </p>
          <img
            src={Blog2Image5}
            className="h-[500px] w-full rounded-lg object-cover shadow-lg"
            alt="Hot-rolled steel beam wrap render"
          />
          <p className="mt-4 text-xl font-semibold text-gray-900">
            Hot-rolled steel beam wrap render
          </p>
          <p className="text-lg text-gray-800">
            All up, we spent near on two weeks between measuring accurately and
            getting these drawn in CAD so that we could manufacture and achieve
            the result needed. Having up to 4x separate junctions’ line up
            perfectly while the measurements of the beams and columns were up to
            30mm out took a lot of skill and we are proud of the execution.
          </p>
          <img
            src={Blog2Image6}
            className="h-[500px] w-full rounded-lg object-cover shadow-lg"
            alt="Installed hot-rolled steel beam wrap"
          />
          <p className="mt-4 text-xl font-semibold text-gray-900">
            Installed hot-rolled steel beam wrap
          </p>
          <p className="text-lg text-gray-800">
            Having an in-house design team with the ability to draw this up in
            CAD, the beams CNC profile cut and CNC press brake folded allowed us
            to create these to fine tolerances.
          </p>
          <img
            src={Blog2Image7}
            className="h-[500px] w-full rounded-lg object-cover shadow-lg"
            alt="Hot-rolled steel folded beam wrap"
          />
          <p className="mt-4 text-xl font-semibold text-gray-900">
            Hot-rolled steel folded beam wrap
          </p>
          <p className="text-lg text-gray-800">
            For us as a business, working on commercial shop fit-out projects
            brings a huge influx of eyes on our work instead of being hidden in
            a private home for only friends and family to see. The feedback we
            have received from the clients and community has been humbling.
          </p>
          <img
            src={Blog2Image8}
            className="h-[500px] w-full rounded-lg object-cover shadow-lg"
            alt="Hot-rolled steel and timber fly bar"
          />
          <p className="mt-4 text-xl font-semibold text-gray-900">
            Hot-rolled steel and timber fly bar
          </p>
          <p className="text-lg text-gray-800">
            We would highly recommend having a look through the store as it is a
            wonderful experience with friendly and knowledgeable staff who love
            to engage and chat about what you’ve been getting up to in the
            outdoors.
          </p>
          <p className="text-lg text-gray-800">
            The address of the store is 49 Beach Street, Queenstown.
          </p>
          <img
            src={Blog2Image9}
            className="h-[500px] w-full rounded-lg object-cover shadow-lg"
            alt="Blackened steel light with matt clear powdercoat"
          />
          <p className="mt-4 text-xl font-semibold text-gray-900">
            Blackened steel light with matt clear powdercoat
          </p>
          <p className="text-lg text-gray-800">
            Images courtesy of{" "}
            <a
              href="https://services.open2view.com/teams/queenstownlakes"
              className="text-blue-600 hover:underline"
            >
              Open2View
            </a>
          </p>
        </div>
      </>
    ),
  },
  {
    id: 3,
    backgroundImage: BLog3BackgroundImage,
    title: "3D modelling for decorative and bespoke metal work.",
    description:
      "In-house 3D modelling by Focal for all decorative and bespoke metal products.",
    author: "George Hayden",
    readTime: "2 min",
    views: "1.2k",
    shares: "1.2k",
    content: (
      <>
        <div className="m-auto my-6 w-[70%] space-y-6 px-[6%] font-body">
          <p className="text-lg text-gray-800">
            Focal has always been of the impression that to be a part of
            award-winning homes, we need to be able to provide award-winning
            products and services and we are always striving to improve our
            systems and processes.
          </p>
          <p className="text-lg text-gray-800">
            We take decorative metal work seriously and offer a full in-house
            design service using Autodesk’s Inventor 3D modelling software. Rob,
            our draughtsman, has a wealth of experience in production
            environments and can liaise with customers and work with them to
            come up with the ultimate solution for their project.
          </p>
          <img
            src={Blog3Image1}
            className="h-[500px] w-full rounded-lg object-cover shadow-lg"
            alt="3D modelling for metal fabrication"
          />
          <p className="mt-4 text-xl font-semibold text-gray-900">
            3D modelling for metal fabrication
          </p>
          <p className="text-lg text-gray-800">
            Architects and interior designers often come to us with ideas of the
            overall design intent of a project and from there, we can create
            models and drawing sets to send back for approval.
          </p>
          <p className="text-lg text-gray-800">
            We know that these designs need to be correct and understand that
            there is back and forth with changes made to these drawings and
            that’s okay. Award-winning homes are not generally done the easy
            way, but we try to make the design process as easy as possible to
            get correct results.
          </p>
          <p className="text-lg text-gray-800">
            Once drawings are approved by our customer, Rob will create a full
            job package that is ready for one of our skilled metal fabricators
            to open on their iPads. The job package includes full working
            drawings along with a job brief that gives them all the information
            that they need to get the job done to our customers’ specifications.
          </p>
          <img
            src={Blog3Image2}
            className="h-[500px] w-full rounded-lg object-cover shadow-lg"
            alt="Bespoke steel doors"
          />
          <p className="mt-4 text-xl font-semibold text-gray-900">
            Bespoke steel doors
          </p>
          <p className="text-lg text-gray-800">
            Cut files are nested and programmed into our CNC plasma by Rob to
            ensure that the layout is most efficient for the job and to minimize
            the need for fabricators to waste time programming.
          </p>
          <p className="text-lg text-gray-800">
            As a part of the job package, sheet metal components will have full
            flat pattern drawings ensuring that the fabricator can easily
            program our CNC press brake and fold/bend items as they have been
            designed in Inventor.
          </p>
          <p className="text-lg text-gray-800">
            Our job packages also include a quality control checklist that our
            fabricators must fill out after every job with another fabricator
            signing off to ensure accountability from both involved.
          </p>
          <img
            src={Blog3Image3}
            className="h-[500px] w-full rounded-lg object-cover shadow-lg"
            alt="3D model chimney aluminium chimney cap"
          />
          <p className="mt-4 text-xl font-semibold text-gray-900">
            3D model chimney aluminium chimney cap
          </p>
        </div>
      </>
    ),
  },
  {
    id: 4,
    backgroundImage: BLog4BackgroundImage,
    title: "CNC Profile cutting",
    description: "Our current in-house CNC profile cutting capabilities.",
    author: "George Hayden",
    readTime: "2 min",
    views: "1.2k",
    shares: "1.2k",
    content: (
      <>
        <div className="m-auto my-6 w-[70%] space-y-6 px-[6%] font-body">
          <p className="text-lg text-gray-800">
            Focal has a CNC plasma cutter in our ever-growing arsenal of tools.
            This allows us to cut all of our own sheet and plate in-house up to
            16mm thick, and with a 1500x3000 bed, we can also cut oversized
            sheets.
          </p>
          <p className="text-lg text-gray-800">
            We invested in this machine as there isn't really anyone local that
            has one and for us, having to get parts laser cut in Invercargill or
            Dunedin just didn't really sit well. As well as utilizing the
            machine for our own projects, we purchased the machine for contract
            cutting for other local businesses and also direct clients.
          </p>
          <p className="text-lg text-gray-800">
            By having a profile cutting machine in Queenstown, clients have
            somebody local to talk to about designs and can pop into the
            workshop. This also reduces the cost of freight and risk of damage
            in transit.
          </p>
          <p className="text-lg text-gray-800">
            We can either draw up designs for you or, we are more than happy for
            you to supply us with your cut-ready DXF files. With most common
            materials and thicknesses in steel, stainless steel, aluminium,
            copper, and brass in stock, a quick turnaround on your parts is also
            our biggest aim.
          </p>
          <p className="text-lg text-gray-800">
            While CNC plasma may not be as accurate as waterjet or laser, it is
            more than good enough for the vast majority of applications. We
            constantly use the machine every day for our own projects and it
            does not reduce the quality of our products.
          </p>
          <p className="text-lg text-gray-800">
            Keep posted as we aim to have a 6KW fiber laser in our arsenal by
            the end of the year.
          </p>
          <img
            src={Blog4Image1}
            className="h-[500px] w-full rounded-lg object-cover shadow-lg"
            alt="CNC cut steel brackets"
          />
          <p className="mt-4 text-xl font-semibold text-gray-900">
            CNC cut steel brackets
          </p>
          <img
            src={Blog4Image2}
            className="h-[500px] w-full rounded-lg object-cover shadow-lg"
            alt="CNC cut steel parts"
          />
          <p className="mt-4 text-xl font-semibold text-gray-900">
            CNC cut steel parts
          </p>
        </div>
      </>
    ),
  },
  {
    id: 5,
    backgroundImage: BLog5BackgroundImage,
    title: "Focal’s metal options",
    description:
      "A write up on the differences in materials available from Focal.",
    author: "George Hayden",
    readTime: "2 min",
    views: "1.2k",
    shares: "1.2k",
    content: (
      <>
        <div className="m-auto my-6 w-[70%] space-y-6 px-[6%] font-body">
          <p className="text-lg text-gray-800">
            Different materials have unique properties based on their chemical
            makeup, and it is essential to consider several factors before
            selecting the right material for your project. Things like budget,
            aesthetics, and the product's environment are crucial factors that
            must be taken into account before making a decision.
          </p>
          <p className="text-lg text-gray-800">
            Steel is the most cost-effective material but is relatively heavy
            and can rust. It requires extra care and protective coatings like
            paint or powder coating to prevent corrosion. However, steel's
            corrosion can also add character to the product, and a clear coat or
            wax finish can help protect the rusted appearance.
          </p>
          <p className="text-lg text-gray-800">
            Stainless steel is a cost-effective way to have a
            corrosion-resistant material. It can be polished to a satin or
            mirror finish and left. It is commonly used for handrails due to its
            durability and resistance to corrosion.
          </p>
          <p className="text-lg text-gray-800">
            Aluminium is more expensive than steel, but it has greater corrosion
            resistance, meaning it does not need to have a coating. It is very
            light in comparison to steel, which makes it easier to handle during
            the manufacturing and installation process.
          </p>
          <p className="text-lg text-gray-800">
            Brass is even more expensive than aluminium but can create a
            stunning look. The material can age naturally or have a patina added
            to achieve the desired look. A clear coat or wax is then used to
            seal it. More consideration needs to be taken with brass as it is
            not as easily welded or brazed as steel or aluminium.
          </p>
          <p className="text-lg text-gray-800">
            Copper is the most expensive material used by Focal, but it is sure
            to make your project stand out. Like brass, it can be left to age
            naturally or have a patina added to it to achieve the desired look.
            The natural oxidation process of copper creates a unique and
            distinctive patina that only improves with time. However, it should
            be noted that copper is a soft metal, and it can be susceptible to
            scratches and dents.
          </p>
          <p className="text-lg text-gray-800">
            Overall, choosing the right material for your project requires a
            careful analysis of your needs and priorities. At Focal, we have
            experience working with various metals and can help guide you in
            selecting the best option for your project.
          </p>
          <p className="text-lg text-gray-800">
            Below are some examples of different materials used throughout
            projects that you can see on our website.
          </p>
          <p className="text-lg text-gray-800">
            Room Divider: Focal created a stunning room divider made from steel
            for a client. The steel was powder coated black to give it a sleek,
            modern look. This is a great example of using steel as a
            cost-effective material that can be coated for protection while also
            adding sophistication with the finish. The steel divider not only
            provides function but also adds an artistic element to the space.
          </p>
          <p className="text-lg text-gray-800">
            Pendant Lights: Focal designed and fabricated a set of pendant
            lights for a restaurant using steel sheet. The steel alone would
            provide a rustic element; however, once painted, the material added
            a touch of elegance and sophistication to the space. As mentioned
            earlier, steel is the cheapest from a cost point of view but when
            done right can provide an amazing look.
          </p>
          <p className="text-lg text-gray-800">
            Handrails and Balustrades: Focal's preference is to create
            balustrades from aluminium. Although the initial outlay in material
            may be more expensive than steel, the labor is actually reduced in
            manufacturing and installation because of the reduction in weight.
            The material is able to be left raw because of its corrosion
            resistance or it can be powdercoated. One example is a project where
            Focal created exterior aluminium balustrading for a pair of homes in
            Queenstown. The finished product was sleek and unobtrusive, blending
            seamlessly with the surrounding architecture.
          </p>
          <p className="text-lg text-gray-800">
            Bespoke Fireplaces: Focal has created several custom fireplaces
            using a variety of materials. One example is a fireplace surround
            made from brass for a client's home. The patina finish of the brass
            added a unique and industrial look to the space. Brass is another
            example of using a material that can have endless possibilities for
            finishes depending on the space and preference of the client. The
            finished product was a beautiful addition to the home, providing
            warmth and style.
          </p>
          <p className="text-lg text-gray-800">
            These are just a few examples of the bespoke work Focal has
            completed using different materials. By taking into consideration
            the client's needs and the specific characteristics of each
            material, Focal is able to create one-of-a-kind pieces that are both
            functional and beautiful.
          </p>
          <img
            src={Blog5Image1}
            className="h-[500px] w-full rounded-lg object-cover shadow-lg"
            alt="Brass patina"
          />
          <p className="mt-4 text-xl font-semibold text-gray-900">
            Brass with a brown patina
          </p>
          <img
            src={Blog5Image2}
            className="h-[500px] w-full rounded-lg object-cover shadow-lg"
            alt="Hot-rolled steel counter"
          />
          <p className="mt-4 text-xl font-semibold text-gray-900">
            Hot-rolled steel waterfall counter sealed with beeswax
          </p>
          <img
            src={Blog5Image3}
            className="h-[500px] w-full rounded-lg object-cover shadow-lg"
            alt="Powdercoated aluminium balustrade"
          />
          <p className="mt-4 text-xl font-semibold text-gray-900">
            Aluminium balustrading finished with black powdercoat
          </p>
        </div>
      </>
    ),
  },
  {
    id: 6,
    backgroundImage: BLog6BackgroundImage,
    title: "Antique and patina finishing on metals",
    description:
      "A quick write up on how we antique finish or force rust some of our products.",
    author: "George Hayden",
    readTime: "2 min",
    views: "1.2k",
    shares: "1.2k",
    content: (
      <>
        <div className="m-auto my-6 w-[70%] space-y-6 px-[6%] font-body">
          <p className="text-lg text-gray-800">
            Focal is a specialist when it comes to different finishes on metal.
            We have been utilizing a number of different processes for years and
            are constantly testing and refining these processes.
          </p>
          <p className="text-lg text-gray-800">
            The patina process is something that we absolutely love to do and it
            is something that is subjective to the client. There is not
            necessarily any wrong results, just differences of opinions and
            preferences.
          </p>
          <p className="text-lg text-gray-800">
            Patina is a naturally occurring process that happens over time to
            metal when exposed to air. The metal will oxidize and change the
            look of the surface. With steel, oxidizing comes in the form of
            rust. With brass and copper, this comes in the form of brown, black
            or green surface depending on the environment and what the metal has
            been exposed to.
          </p>
          <p className="text-lg text-gray-800">
            We can expedite this oxidizing process with special acids and get
            the metal to be the colour that the client wants and then we seal
            this to lock the colour in. There are a few different ways that we
            can seal in the patina with either beeswax, a matt or satin clear
            lacquer, or a matt clear powdercoat.
          </p>
          <img
            src={Blog6Image1}
            className="h-[500px] w-full rounded-lg object-cover shadow-lg"
            alt="Patina process on brass and copper"
          />
          <p className="mt-4 text-xl font-semibold text-gray-900">
            How we patina brass and copper:
          </p>
          <p className="text-lg text-gray-800">
            First we need to make sure that no skin is exposed and that we have
            all of our safety gear on including gloves, respirators, and eye
            protection and that we are in a well ventilated area-These acids are
            nasty!
          </p>
          <p className="text-lg text-gray-800">
            The acid needs to be diluted with water- We generally dilute it 50%
            remembering the golden rule of working with acids- always add acid
            to water and never the other way around.
          </p>
          <p className="text-lg text-gray-800">
            Before applying any acid to metal, you will need to make sure that
            the metal has been thoroughly cleaned. Generally we will first use
            scotchbrite as this helps the patina bite into the metal and then we
            will use a thinner. Any finger marks or other imperfections will
            have the patina reacting differently in these areas.
          </p>
          <p className="text-lg text-gray-800">
            Depending on the situation, it will change how we apply the patina.
            If we are doing panels, then we will apply it with a spray gun with
            the panel lying flat. Any pooling or running of patina will result
            in different reactions showing up in those areas. We have found that
            you need to act quickly as the acid is corrosive and can easily
            damage the gun. A gravity fed gun with a plastic cup works best as
            the plastic will not corrode; however, the insides of the gun still
            can.
          </p>
          <p className="text-lg text-gray-800">
            Other ways to apply the acid can be with a brush or a rag that has
            been sitting in the solution.
          </p>
          <p className="text-lg text-gray-800">
            Whatever way that you choose to apply it, the number one thing that
            you need to remember is that you will apply it, and then quickly
            wipe it back off with a clean rag.
          </p>
          <p className="text-lg text-gray-800">
            You may need to do this process 10-20 times until you get the
            desired colour. This is the part where you need to use your judgment
            as there are a lot of factors that can affect the outcome of the
            colour and even if you do the exact same process, the next part may
            not be the same and you may need to do this more or less times.
          </p>
          <p className="text-lg text-gray-800">
            Once you have achieved the colour that you want, you will need to
            use water over the area to neutralise the acid reaction.
          </p>
          <p className="text-lg text-gray-800">
            It is best to seal the metal as soon as possible once you have
            finished as even though the acid has been neutralised, it can still
            change.
          </p>
          <p className="text-lg text-gray-800">
            After you have finished, make sure that you dispose of all of the
            chemicals correctly and do not put them down the sink.
          </p>
          <img
            src={Blog6Image2}
            className="h-[500px] w-full rounded-lg object-cover shadow-lg"
            alt="Patina process on steel"
          />
          <p className="mt-4 text-xl font-semibold text-gray-900">
            Patina/force rusting steel:
          </p>
          <p className="text-lg text-gray-800">
            A lot of clients love the cor-ten steel look with rusted steel. This
            can be done with all types of steel. The difference with cor-ten is
            that once the initial rust takes hold, it will protect the rest of
            the steel. With mild steel, it will continue to rust.
          </p>
          <img
            src={Blog6Image3}
            className="h-[500px] w-full rounded-lg object-cover shadow-lg"
            alt="Corten steel sign"
          />
          <p className="mt-4 text-xl font-semibold text-gray-900">
            Steel after spirit of salts has been used.
          </p>
          <img
            src={Blog6Image4}
            className="h-[500px] w-full rounded-lg object-cover shadow-lg"
            alt="Rusted corten steel sign"
          />
          <p className="mt-4 text-xl font-semibold text-gray-900">
            Steel once it has been force rusted.
          </p>
          <p className="text-lg text-gray-800">How to force rust steel:</p>
          <p className="text-lg text-gray-800">
            Steel over 3mm thick will always come with a black layer called mill
            scale. This happens in the manufacturing process in the steel mill.
            A lot of people love this look as it gives the steel a beautiful and
            natural look. This mill scale also protects the steel from corrosion
            (to a point).
          </p>
          <p className="text-lg text-gray-800">
            To rust steel, this layer of mill scale needs to be removed. To do
            this, we use a product called 'spirit of salts'. This is a mixture
            that contains hydrogen chloride and water. Like the patina, it is a
            nasty chemical that requires protective gear.
          </p>
          <p className="text-lg text-gray-800">
            Coating the steel in this chemical will quickly start to remove the
            mill scale.
          </p>
          <p className="text-lg text-gray-800">
            Once the mill scale has been removed- generally it should be within
            30 minutes, you can wash it off.
          </p>
          <p className="text-lg text-gray-800">
            After the mill scale has been washed off, the quickest way to get
            your items to rust is to leave them outside in the elements. They
            will be fairly rusted overnight; however, the longer you wait, the
            more consistent the rust colour will be.
          </p>
          <p className="text-lg text-gray-800">
            After you have waited a few days and are happy with the colour, you
            can wipe off the excess rust with a rag and then install your parts.
          </p>
          <p className="text-lg text-gray-800">
            The thing that we love about these processes is that it is
            completely subjective. You can have a lot of fun experimenting with
            different finishes and patterns.
          </p>
          <p className="text-lg text-gray-800">
            An example here is building layer upon layer of patina and then
            using scotchbrite to take off little bits here and there which gives
            it a naturally tarnished look- have fun!
          </p>
          <img
            src={Blog6Image5}
            className="h-[500px] w-full rounded-lg object-cover shadow-lg"
            alt="Patina process on steel"
          />
          <p className="mt-4 text-xl font-semibold text-gray-900">
            Steel after spirit of salts has been used.
          </p>
          <img
            src={Blog6Image6}
            className="h-[500px] w-full rounded-lg object-cover shadow-lg"
            alt="Rusted corten steel sign"
          />
          <p className="mt-4 text-xl font-semibold text-gray-900">
            Steel once it has been force rusted.
          </p>
        </div>
      </>
    ),
  },
];
