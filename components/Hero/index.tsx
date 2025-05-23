import Link from "next/link";


const Hero = () => {
  return (
    <>
      <div
        id="home"
        // className="relative z-10 overflow-hidden bg-white pb-16 pt-[120px] dark:bg-gray-dark md:pb-[120px] md:pt-[150px] xl:pb-[160px] xl:pt-[180px] 2xl:pb-[200px] 2xl:pt-[210px]"
        className="relative z-10 overflow-hidden  flex items-center justify-center flex-grow "
      >
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="mx-auto max-w-[800px] text-center">
                <h1 className="mb-5 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight">
                  Contract Monitoring System (CMS)
                </h1>
                <p className="mb-12 text-base !leading-relaxed text-body-color dark:text-body-color-dark sm:text-lg md:text-xl">
                  The PPDA Contract Monitoring System (CMS) is a digital platform that empowers Civil Society Organizations (CSOs)
                  to track and report on ongoing government projects. Through real-time monitoring, evidence-based reporting,
                  and secure data management, the CMS ensures transparency and accountability in public procurement.
                </p>
                <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <Link
                    href="https://www.ppda.go.ug"
                    className="rounded-sm bg-primary px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-primary/80"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn More
                  </Link>
                  <Link
                    href="https://play.google.com/store/apps/details?id=cms.ppda"
                    className="inline-block rounded-sm bg-black px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-black/90 dark:bg-white/10 dark:text-white dark:hover:bg-white/5"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download the CMS App
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="absolute right-[-20rem] top-0 z-[-1] opacity-30 lg:opacity-30 pt-12">


          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={500}
            height={570}
            viewBox="0 0 925.49161 570"
          >
            <path fill="#f0f0f0" d="M738.492 540h34v30h-34z" />
            <path
              fill="#f2f2f2"
              d="M925.492 252a251.967 251.967 0 0 1-131.09 221.16c-2.25 1.23-4.53 2.43-6.82 3.59a246.249 246.249 0 0 1-26.17 11.48q-5.34 2.01-10.79 3.74c-.35.12-.71.24-1.06.34a251.51 251.51 0 0 1-213.85-29.28q-6.285-4.11-12.31-8.58a239.96 239.96 0 0 1-6.72-5.18q-9.375-7.44-18-15.77a251.213 251.213 0 0 1-77.19-181.5c0-139.18 112.82-252 252-252s252 112.82 252 252Z"
            />
            <path
              fill="#3f3d56"
              d="m733.672 369.6-5.68 21.48 21.57 101.23a253.045 253.045 0 0 1-176.4-9.07l16.84-70.61.56-38.3 1.83-126.29.46-.24a.359.359 0 0 1 .09-.04l42.9-22.03 74.02-1.85 55.23 26.9-.42 1.57Z"
            />
            <path
              fill="#9e616a"
              d="M763.936 554.144a18.077 18.077 0 0 1 4.826-27.296l-12.015-63.107 30.814 12.842 6.685 57.958a18.175 18.175 0 0 1-30.31 19.603Z"
            />
            <path
              fill="#3f3d56"
              d="m753.958 252.744 7.906-2.573s25.081 16.096 22.695 55.012c0 0 .94 20.138.042 33.54-1.03 15.372 12.77 168.128 12.77 168.128h-44.693l-19.154-138.333Z"
            />
            <path
              fill="#9e616a"
              d="M728.035 154.83a51.311 51.311 0 1 1-51.311-51.311 51.183 51.183 0 0 1 51.31 51.055v.256Z"
            />
            <path
              fill="#2f2e41"
              d="M625.583 85.91c6.011-12.925 17.643-10.37 27.816-5.989 12.883-2.857 25.135-11.412 39.016-6.353 13.672 19.886 59.578 14.035 49.811 46.41-.012 7.758 14.598 3.242 12.047 15.948 7.74 24.451-27.936 70.758-48.417 61.007 5.065-9.284 16.636-30.369-.914-32.46-37.752 35.127-3.895-66.89-51.33-37.222-15.706 14.373-37.208-26.964-28.029-41.341Z"
            />
            <path
              fill="#e4e4e4"
              d="m704.103 497.505-81.906-16.223 21.002-106.039q43.471 16.442 81.906 16.222c-22.393 32.841-32.566 68.104-21.002 106.04Z"
            />
            <path
              fill="#6c63ff"
              d="m692.194 503.733-81.906-16.222c-6.724-48.04-.612-84.208 21.002-106.04q43.47 16.443 81.906 16.223a292.1 292.1 0 0 0-21.002 106.04Z"
            />
            <path
              fill="#9e616a"
              d="M637.926 474.195a18.077 18.077 0 0 0-23.278-15.05l-38.038-51.768-11.576 31.312 37.897 44.359a18.175 18.175 0 0 0 34.995-8.853Z"
            />
            <path
              fill="#3f3d56"
              d="m603.82 250.771-6.891-4.653s-41 3.817-49.437 41.882c0 0-6.167 22.87-9 36-1.457 6.753-20.886 72-20.886 72l65.886 72 18-27-18-45Z"
            />
            <path
              fill="#6c63ff"
              d="M0 126.519h34v30H0zM73 246.519h34v30H73zM126 451.519h34v30h-34z"
            />
            <path
              fill="#e4e4e4"
              d="M126.247 57.649a3.8 3.8 0 0 0 0 7.6H403.7a3.8 3.8 0 0 0 0-7.6ZM126.247 80.45a3.8 3.8 0 1 0-.016 7.6h175.408a3.8 3.8 0 1 0 0-7.6ZM90.247 330.649a3.8 3.8 0 0 0 0 7.6H367.7a3.8 3.8 0 0 0 0-7.6ZM90.247 353.45a3.8 3.8 0 1 0-.016 7.6h175.408a3.8 3.8 0 1 0 0-7.6ZM248.247 525.649a3.8 3.8 0 0 0 0 7.6h277.452a3.8 3.8 0 0 0 0-7.6ZM248.247 548.45a3.8 3.8 0 1 0-.016 7.6h175.408a3.8 3.8 0 1 0 0-7.6Z"
            />
            <path
              fill="#3f3d56"
              d="M15.988 141.655a62.555 62.555 0 0 0 39.669-28.009 59.945 59.945 0 0 0 6.013-12.829 1.501 1.501 0 0 0-2.84-.967 59.53 59.53 0 0 1-30.728 34.562 56.357 56.357 0 0 1-12.675 4.296c-1.89.398-1.332 3.346.561 2.947Z"
            />
            <path
              fill="#3f3d56"
              d="m45.218 106.562 16.223-9.136c.25-.14.952-.672 1.214-.608-.21-.051-.02.104-.013.294.008.256.04.516.05.773.059 1.58.087 3.16.131 4.74l.252 9.085c.052 1.912 3.047 2.14 2.993.205l-.295-10.665c-.068-2.444.544-7.865-3.417-7.397-1.429.17-2.75 1.17-3.969 1.857l-4.937 2.78-9.523 5.363c-1.677.945-.393 3.658 1.29 2.71ZM90.308 261.413a62.547 62.547 0 0 0-38.49 29.574 59.854 59.854 0 0 0-5.489 13.053 1.501 1.501 0 0 0 2.893.797 59.554 59.554 0 0 1 29.383-35.753 56.32 56.32 0 0 1 12.5-4.778c1.871-.472 1.078-3.366-.797-2.893Z"
            />
            <path
              fill="#3f3d56"
              d="m62.49 297.653-15.676 9.665c-.269.165-.533.346-.813.493-.277.147-.563.142-.383.318-.242-.237-.18-1.119-.199-1.388l-.305-4.534-.61-9.068c-.13-1.916-3.13-1.93-3 0l.716 10.645c.164 2.424-.288 7.44 3.423 7.238 1.652-.09 3.226-1.447 4.58-2.282l4.48-2.762 9.302-5.735c1.64-1.011.135-3.607-1.514-2.59ZM141.895 465.306a59.547 59.547 0 0 1 36.697 28.196 56.297 56.297 0 0 1 5.186 12.335 1.501 1.501 0 0 0 2.893-.797 62.541 62.541 0 0 0-30.762-37.547 59.832 59.832 0 0 0-13.217-5.08c-1.872-.472-2.671 2.42-.797 2.893Z"
            />
            <path
              fill="#3f3d56"
              d="m168.995 501.243 9.303 5.735 4.479 2.762c1.357.837 2.925 2.192 4.58 2.282 3.71.203 3.26-4.813 3.423-7.238l.717-10.645c.13-1.927-2.871-1.919-3 0l-.611 9.068-.292 4.337c-.023.332.064 1.31-.212 1.585.197-.197-.008-.103-.228-.236-.32-.195-.648-.378-.968-.575l-15.677-9.665c-1.648-1.016-3.156 1.577-1.514 2.59Z"
            />
            <circle cx={68} cy={71.519} r={14} fill="#6c63ff" />
            <circle cx={44} cy={345.849} r={14} fill="#6c63ff" />
            <circle cx={195} cy={540.519} r={14} fill="#6c63ff" />
          </svg>




        </div>
        <div className="absolute bottom-0 left-0 z-[-1] opacity-30 lg:opacity-100">
          <svg
            width="364"
            height="201"
            viewBox="0 0 364 201"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.88928 72.3303C33.6599 66.4798 101.397 64.9086 150.178 105.427C211.155 156.076 229.59 162.093 264.333 166.607C299.076 171.12 337.718 183.657 362.889 212.24"
              stroke="url(#paint0_linear_25:218)"
            />
            <path
              d="M-22.1107 72.3303C5.65989 66.4798 73.3965 64.9086 122.178 105.427C183.155 156.076 201.59 162.093 236.333 166.607C271.076 171.12 309.718 183.657 334.889 212.24"
              stroke="url(#paint1_linear_25:218)"
            />
            <path
              d="M-53.1107 72.3303C-25.3401 66.4798 42.3965 64.9086 91.1783 105.427C152.155 156.076 170.59 162.093 205.333 166.607C240.076 171.12 278.718 183.657 303.889 212.24"
              stroke="url(#paint2_linear_25:218)"
            />
            <path
              d="M-98.1618 65.0889C-68.1416 60.0601 4.73364 60.4882 56.0734 102.431C120.248 154.86 139.905 161.419 177.137 166.956C214.37 172.493 255.575 186.165 281.856 215.481"
              stroke="url(#paint3_linear_25:218)"
            />
            <circle
              opacity="0.8"
              cx="214.505"
              cy="60.5054"
              r="49.7205"
              transform="rotate(-13.421 214.505 60.5054)"
              stroke="url(#paint4_linear_25:218)"
            />
            <circle cx="220" cy="63" r="43" fill="url(#paint5_radial_25:218)" />
            <defs>
              <linearGradient
                id="paint0_linear_25:218"
                x1="184.389"
                y1="69.2405"
                x2="184.389"
                y2="212.24"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_25:218"
                x1="156.389"
                y1="69.2405"
                x2="156.389"
                y2="212.24"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_25:218"
                x1="125.389"
                y1="69.2405"
                x2="125.389"
                y2="212.24"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" />
              </linearGradient>
              <linearGradient
                id="paint3_linear_25:218"
                x1="93.8507"
                y1="67.2674"
                x2="89.9278"
                y2="210.214"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" />
              </linearGradient>
              <linearGradient
                id="paint4_linear_25:218"
                x1="214.505"
                y1="10.2849"
                x2="212.684"
                y2="99.5816"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <radialGradient
                id="paint5_radial_25:218"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(220 63) rotate(90) scale(43)"
              >
                <stop offset="0.145833" stopColor="white" stopOpacity="0" />
                <stop offset="1" stopColor="white" stopOpacity="0.08" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </>
  );
};

export default Hero;
