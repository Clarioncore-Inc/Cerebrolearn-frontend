import svgPaths from "./svg-tpq70jnat3";
import imgAvatar from "figma:asset/055e82aab63cc264d66a75e64837ab8a2d2b07de.png";
import imgImage from "figma:asset/2032fc19b38e203a661b2856012b01f2c17133fd.png";
import imgImage1 from "figma:asset/aa0e63b4b72dafa20ebf705cb3408f9d3a4343ef.png";
import imgImage2 from "figma:asset/908f6e6dadefff9c6fad99774e0aa7808b2270ab.png";

function Content() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Content">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Content">
          <g clipPath="url(#clip0_64_14916)">
            <rect fill="var(--fill-0, white)" height="32" rx="8" width="32" />
            <rect fill="url(#paint0_linear_64_14916)" height="32" rx="8" width="32" />
            <g id="Grid">
              <path clipRule="evenodd" d={svgPaths.p14f5bbf2} fill="var(--fill-0, #D0D5DD)" fillRule="evenodd" id="Circle" />
              <path clipRule="evenodd" d={svgPaths.p33940f40} fill="var(--fill-0, #D0D5DD)" fillRule="evenodd" id="Circle_2" />
              <path clipRule="evenodd" d={svgPaths.p1a77d880} fill="var(--fill-0, #D0D5DD)" fillRule="evenodd" id="Circle_3" />
              <path d={svgPaths.p282127c0} fill="var(--fill-0, #D0D5DD)" id="Line" />
              <path d={svgPaths.p3a4c5e00} fill="var(--fill-0, #D0D5DD)" id="Line_2" />
              <path d={svgPaths.p240dce00} fill="var(--fill-0, #D0D5DD)" id="Line_3" />
              <path d={svgPaths.p327783f0} fill="var(--fill-0, #D0D5DD)" id="Line_4" />
              <path d={svgPaths.p10e30600} fill="var(--fill-0, #D0D5DD)" id="Line_5" />
              <path d={svgPaths.p6903b00} fill="var(--fill-0, #D0D5DD)" id="Line_6" />
              <path d={svgPaths.p120fc980} fill="var(--fill-0, #D0D5DD)" id="Line_7" />
              <path d={svgPaths.p23245a00} fill="var(--fill-0, #D0D5DD)" id="Line_8" />
              <path d={svgPaths.p34262d80} fill="var(--fill-0, #D0D5DD)" id="Line_9" />
              <path d={svgPaths.p2c03df40} fill="var(--fill-0, #D0D5DD)" id="Line_10" />
            </g>
            <path d={svgPaths.pbaacf00} fill="var(--fill-0, #395192)" id="Vector" />
            <g data-figma-bg-blur-radius="5" id="Blur">
              <path d={svgPaths.p28970330} fill="var(--fill-0, white)" fillOpacity="0.05" />
            </g>
          </g>
          <rect height="31.8" rx="7.9" stroke="var(--stroke-0, #D0D5DD)" strokeWidth="0.2" width="31.8" x="0.1" y="0.1" />
        </g>
        <defs>
          <clipPath id="bgblur_1_64_14916_clip_path" transform="translate(5 -22)">
            <path d={svgPaths.p28970330} />
          </clipPath>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_64_14916" x1="16" x2="16" y1="0" y2="32">
            <stop stopColor="white" />
            <stop offset="1" stopColor="#D0D5DD" />
          </linearGradient>
          <clipPath id="clip0_64_14916">
            <rect fill="white" height="32" rx="8" width="32" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function DidacticLogomark() {
  return (
    <div className="box-border content-stretch flex items-start relative shadow-[0px_1px_3px_0px_rgba(16,24,40,0.1),0px_1px_2px_0px_rgba(16,24,40,0.06)] shrink-0" data-name="Didactic Logomark">
      <Content />
    </div>
  );
}

function DidacticLogos() {
  return (
    <div className="content-stretch flex gap-[10px] items-center overflow-clip relative shrink-0" data-name="Didactic Logos">
      <div className="flex flex-col font-['Inter:Extra_Bold',sans-serif] font-extrabold justify-end leading-[0] not-italic relative shrink-0 text-[#395192] text-[20px] text-nowrap tracking-[1px]">
        <p className="leading-[24px] whitespace-pre">CerebroLearn</p>
      </div>
    </div>
  );
}

function Logotype() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] items-start justify-center px-0 py-[3px] relative shrink-0" data-name="Logotype">
      <DidacticLogos />
    </div>
  );
}

function LogoWrap() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-name="Logo wrap">
      <DidacticLogomark />
      <Logotype />
    </div>
  );
}

function CerebroLearnLogo() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[142px]" data-name="CerebroLearn Logo">
      <LogoWrap />
    </div>
  );
}

function Menu() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="menu-01">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="menu-01">
          <path d="M3 12H21M3 6H21M3 18H21" id="Icon" stroke="var(--stroke-0, #344054)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function NavMenuButton() {
  return (
    <div className="box-border content-stretch flex gap-[8px] h-[26px] items-center justify-center overflow-clip p-[8px] relative rounded-[8px] shrink-0 w-[27px]" data-name="_Nav menu button">
      <Menu />
    </div>
  );
}

function Header() {
  return (
    <div className="relative shrink-0 w-full" data-name="Header">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex items-center justify-between pl-[24px] pr-[20px] py-0 relative w-full">
          <CerebroLearnLogo />
          <NavMenuButton />
        </div>
      </div>
    </div>
  );
}

function SearchLg() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="search-lg">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="search-lg">
          <path d={svgPaths.p22fdb270} id="Icon" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Content1() {
  return (
    <div className="basis-0 content-stretch flex gap-[8px] grow items-center min-h-px min-w-px relative shrink-0" data-name="Content">
      <SearchLg />
      <p className="[white-space-collapse:collapse] basis-0 font-['Roboto:Regular',sans-serif] font-normal grow leading-[24px] min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-[#667085] text-[16px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Search
      </p>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center px-[14px] py-[10px] relative w-full">
          <Content1 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]" />
    </div>
  );
}

function InputWithLabel() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="Input with label">
      <Input />
    </div>
  );
}

function InputDropdown() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Input dropdown">
      <InputWithLabel />
    </div>
  );
}

function Search() {
  return (
    <div className="relative shrink-0 w-full" data-name="Search">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col items-start px-[24px] py-0 relative w-full">
          <InputDropdown />
        </div>
      </div>
    </div>
  );
}

function BarChartSquare() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="bar-chart-square-02">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="bar-chart-square-02">
          <path d={svgPaths.p1fba1600} id="Icon" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Content2() {
  return (
    <div className="basis-0 content-stretch flex gap-[12px] grow items-center min-h-px min-w-px relative shrink-0" data-name="Content">
      <BarChartSquare />
      <p className="font-['Roboto:SemiBold',sans-serif] font-semibold leading-[24px] relative shrink-0 text-[#344054] text-[16px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Dashboard
      </p>
    </div>
  );
}

function NavItemBase() {
  return (
    <div className="basis-0 bg-white grow h-full min-h-px min-w-px relative rounded-[6px] shrink-0" data-name="_Nav item base">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative size-full">
          <Content2 />
        </div>
      </div>
    </div>
  );
}

function NavItemDropdownBase() {
  return (
    <div className="content-stretch flex h-[40px] items-start relative shrink-0 w-full" data-name="_Nav item dropdown base">
      <NavItemBase />
    </div>
  );
}

function LayersThree() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="layers-three-01">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="layers-three-01">
          <path d={svgPaths.p24e90a00} id="Icon" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Content3() {
  return (
    <div className="basis-0 content-stretch flex gap-[12px] grow items-center min-h-px min-w-px relative shrink-0" data-name="Content">
      <LayersThree />
      <p className="font-['Roboto:SemiBold',sans-serif] font-semibold leading-[24px] relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        My Courses
      </p>
    </div>
  );
}

function NavItemBase1() {
  return (
    <div className="basis-0 bg-[#395192] grow min-h-px min-w-px relative rounded-[6px] self-stretch shrink-0" data-name="_Nav item base">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative size-full">
          <Content3 />
        </div>
      </div>
    </div>
  );
}

function NavItemDropdownBase1() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="_Nav item dropdown base">
      <NavItemBase1 />
    </div>
  );
}

function FileQuestion() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="file-question-02">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="file-question-02">
          <path d={svgPaths.p1f80c00} id="Icon" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Content4() {
  return (
    <div className="basis-0 content-stretch flex gap-[12px] grow items-center min-h-px min-w-px relative shrink-0" data-name="Content">
      <FileQuestion />
      <p className="font-['Roboto:SemiBold',sans-serif] font-semibold leading-[24px] relative shrink-0 text-[#344054] text-[16px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Tests
      </p>
    </div>
  );
}

function NavItemBase2() {
  return (
    <div className="basis-0 bg-white grow min-h-px min-w-px relative rounded-[6px] self-stretch shrink-0" data-name="_Nav item base">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative size-full">
          <Content4 />
        </div>
      </div>
    </div>
  );
}

function NavItemDropdownBase2() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="_Nav item dropdown base">
      <NavItemBase2 />
    </div>
  );
}

function Star() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="star-01">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="star-01">
          <path d={svgPaths.p24510400} id="Icon" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Content5() {
  return (
    <div className="basis-0 content-stretch flex gap-[12px] grow items-center min-h-px min-w-px relative shrink-0" data-name="Content">
      <Star />
      <p className="font-['Roboto:SemiBold',sans-serif] font-semibold leading-[24px] relative shrink-0 text-[#344054] text-[16px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Reviews
      </p>
    </div>
  );
}

function NavItemBase3() {
  return (
    <div className="basis-0 bg-white grow min-h-px min-w-px relative rounded-[6px] self-stretch shrink-0" data-name="_Nav item base">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative size-full">
          <Content5 />
        </div>
      </div>
    </div>
  );
}

function NavItemDropdownBase3() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="_Nav item dropdown base">
      <NavItemBase3 />
    </div>
  );
}

function ShoppingCart() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="shopping-cart-03">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="shopping-cart-03">
          <path d={svgPaths.p276f9080} id="Icon" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Content6() {
  return (
    <div className="basis-0 content-stretch flex gap-[12px] grow items-center min-h-px min-w-px relative shrink-0" data-name="Content">
      <ShoppingCart />
      <p className="font-['Roboto:SemiBold',sans-serif] font-semibold leading-[24px] relative shrink-0 text-[#344054] text-[16px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Order History
      </p>
    </div>
  );
}

function NavItemBase4() {
  return (
    <div className="basis-0 bg-white grow min-h-px min-w-px relative rounded-[6px] self-stretch shrink-0" data-name="_Nav item base">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative size-full">
          <Content6 />
        </div>
      </div>
    </div>
  );
}

function NavItemDropdownBase4() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="_Nav item dropdown base">
      <NavItemBase4 />
    </div>
  );
}

function Navigation() {
  return (
    <div className="relative shrink-0 w-full" data-name="Navigation">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[4px] items-start px-[16px] py-0 relative w-full">
          <NavItemDropdownBase />
          <NavItemDropdownBase1 />
          <NavItemDropdownBase2 />
          <NavItemDropdownBase3 />
          <NavItemDropdownBase4 />
        </div>
      </div>
    </div>
  );
}

function Navigation1() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[24px] items-start pb-0 pt-[32px] px-0 relative shrink-0 w-full" data-name="Navigation">
      <Header />
      <Search />
      <Navigation />
    </div>
  );
}

function LifeBuoy() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="life-buoy-01">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="life-buoy-01">
          <path d={svgPaths.p11cb09f0} id="Icon" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Content7() {
  return (
    <div className="basis-0 content-stretch flex gap-[12px] grow items-center min-h-px min-w-px relative shrink-0" data-name="Content">
      <LifeBuoy />
      <p className="font-['Roboto:SemiBold',sans-serif] font-semibold leading-[24px] relative shrink-0 text-[#344054] text-[16px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Support
      </p>
    </div>
  );
}

function NavItemBase5() {
  return (
    <div className="bg-white relative rounded-[6px] shrink-0 w-full" data-name="_Nav item base">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative w-full">
          <Content7 />
        </div>
      </div>
    </div>
  );
}

function Settings() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="settings-01">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="settings-01">
          <g id="Icon">
            <path d={svgPaths.p3cccb600} stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d={svgPaths.pf152080} stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Content8() {
  return (
    <div className="basis-0 content-stretch flex gap-[12px] grow items-center min-h-px min-w-px relative shrink-0" data-name="Content">
      <Settings />
      <p className="font-['Roboto:SemiBold',sans-serif] font-semibold leading-[24px] relative shrink-0 text-[#344054] text-[16px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Settings
      </p>
    </div>
  );
}

function NavItemBase6() {
  return (
    <div className="bg-white relative rounded-[6px] shrink-0 w-full" data-name="_Nav item base">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative w-full">
          <Content8 />
        </div>
      </div>
    </div>
  );
}

function Navigation2() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Navigation">
      <NavItemBase5 />
      <NavItemBase6 />
    </div>
  );
}

function ContrastBorder() {
  return <div className="absolute border-[0.75px] border-black border-solid inset-0 opacity-[0.08] rounded-[200px]" data-name="Contrast border" />;
}

function Avatar() {
  return (
    <div className="relative rounded-[200px] shrink-0 size-[40px]" data-name="Avatar">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[200px] size-full" src={imgAvatar} />
      <ContrastBorder />
    </div>
  );
}

function TextAndSupportingText() {
  return (
    <div className="content-stretch flex flex-col items-start leading-[20px] relative shrink-0 text-[14px] text-nowrap whitespace-pre" data-name="Text and supporting text">
      <p className="font-['Roboto:SemiBold',sans-serif] font-semibold relative shrink-0 text-[#344054]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Phoenix Baker
      </p>
      <p className="font-['Inter:Regular',sans-serif] font-normal not-italic relative shrink-0 text-[#475467]">Student Account</p>
    </div>
  );
}

function AvatarLabelGroup() {
  return (
    <div className="basis-0 content-stretch flex gap-[12px] grow items-center min-h-px min-w-px relative shrink-0" data-name="Avatar label group">
      <Avatar />
      <TextAndSupportingText />
    </div>
  );
}

function LogOut() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="log-out-01">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="log-out-01">
          <path d={svgPaths.p2f81c180} id="Icon" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function SubTopicCard() {
  return (
    <div className="absolute box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[8px] right-0 rounded-[8px] top-[16px]" data-name="Sub Topic Card">
      <LogOut />
    </div>
  );
}

function Account() {
  return (
    <div className="relative shrink-0 w-full" data-name="Account">
      <div aria-hidden="true" className="absolute border-[#eaecf0] border-[1px_0px_0px] border-solid inset-0 pointer-events-none" />
      <div className="size-full">
        <div className="box-border content-stretch flex gap-[16px] items-start pb-0 pl-[8px] pr-[32px] pt-[24px] relative w-full">
          <AvatarLabelGroup />
          <SubTopicCard />
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="relative shrink-0 w-full" data-name="Footer">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] items-start pb-[32px] pt-0 px-[16px] relative w-full">
          <Navigation2 />
          <Account />
        </div>
      </div>
    </div>
  );
}

function Content9() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow h-full items-start justify-between min-h-px min-w-px relative shrink-0" data-name="Content">
      <Navigation1 />
      <Footer />
    </div>
  );
}

function SidebarNavigation() {
  return (
    <div className="bg-white content-stretch flex h-full items-start shrink-0 sticky top-0 w-[312px]" data-name="Sidebar navigation">
      <div aria-hidden="true" className="absolute border-[#eaecf0] border-[0px_1px_0px_0px] border-solid inset-0 pointer-events-none" />
      <Content9 />
    </div>
  );
}

function TextAndSupportingText1() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[4px] grow items-start min-h-px min-w-[320px] relative shrink-0" data-name="Text and supporting text">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[38px] not-italic relative shrink-0 text-[#101828] text-[30px] w-full">Enrolled Courses</p>
    </div>
  );
}

function SearchLg1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="search-lg">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="search-lg">
          <path d={svgPaths.p22fdb270} id="Icon" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Content10() {
  return (
    <div className="basis-0 content-stretch flex gap-[8px] grow items-center min-h-px min-w-px relative shrink-0" data-name="Content">
      <SearchLg1 />
      <p className="[white-space-collapse:collapse] basis-0 font-['Roboto:Regular',sans-serif] font-normal grow leading-[24px] min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-[#667085] text-[16px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Search
      </p>
    </div>
  );
}

function Input1() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center px-[14px] py-[10px] relative w-full">
          <Content10 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]" />
    </div>
  );
}

function InputWithLabel1() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="Input with label">
      <Input1 />
    </div>
  );
}

function InputDropdown1() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start max-w-[320px] min-h-px min-w-[200px] relative shrink-0" data-name="Input dropdown">
      <InputWithLabel1 />
    </div>
  );
}

function Content11() {
  return (
    <div className="content-start flex flex-wrap gap-[16px] items-start relative shrink-0 w-full" data-name="Content">
      <TextAndSupportingText1 />
      <InputDropdown1 />
    </div>
  );
}

function PageHeader() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full" data-name="Page header">
      <Content11 />
    </div>
  );
}

function Badge() {
  return (
    <div className="bg-[#f7f8ff] box-border content-stretch flex items-center px-[8px] py-[2px] relative rounded-[16px] shrink-0" data-name="Badge">
      <div aria-hidden="true" className="absolute border border-[#dee7ff] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[18px] relative shrink-0 text-[#052d69] text-[12px] text-center text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        9
      </p>
    </div>
  );
}

function TextAndBadge() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0" data-name="Text and badge">
      <p className="font-['Roboto:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[#052d69] text-[14px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Enrolled Courses
      </p>
      <Badge />
    </div>
  );
}

function TabButtonBase() {
  return (
    <div className="box-border content-stretch flex gap-[8px] h-[32px] items-center justify-center pb-[12px] pt-0 px-[4px] relative shrink-0" data-name="_Tab button base">
      <div aria-hidden="true" className="absolute border-[#395192] border-[0px_0px_2px] border-solid inset-0 pointer-events-none" />
      <TextAndBadge />
    </div>
  );
}

function Badge1() {
  return (
    <div className="bg-gray-50 box-border content-stretch flex items-center px-[8px] py-[2px] relative rounded-[16px] shrink-0" data-name="Badge">
      <div aria-hidden="true" className="absolute border border-[#eaecf0] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[18px] relative shrink-0 text-[#344054] text-[12px] text-center text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        2
      </p>
    </div>
  );
}

function TextAndBadge1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0" data-name="Text and badge">
      <p className="font-['Roboto:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[#667085] text-[14px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Active Courses
      </p>
      <Badge1 />
    </div>
  );
}

function TabButtonBase1() {
  return (
    <div className="box-border content-stretch flex gap-[8px] h-[32px] items-center justify-center pb-[12px] pt-0 px-[4px] relative shrink-0" data-name="_Tab button base">
      <TextAndBadge1 />
    </div>
  );
}

function Badge2() {
  return (
    <div className="bg-gray-50 box-border content-stretch flex items-center px-[8px] py-[2px] relative rounded-[16px] shrink-0" data-name="Badge">
      <div aria-hidden="true" className="absolute border border-[#eaecf0] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[18px] relative shrink-0 text-[#344054] text-[12px] text-center text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        2
      </p>
    </div>
  );
}

function TextAndBadge2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0" data-name="Text and badge">
      <p className="font-['Roboto:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[#667085] text-[14px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Completed Courses
      </p>
      <Badge2 />
    </div>
  );
}

function TabButtonBase2() {
  return (
    <div className="box-border content-stretch flex gap-[8px] h-[32px] items-center justify-center pb-[12px] pt-0 px-[4px] relative shrink-0" data-name="_Tab button base">
      <TextAndBadge2 />
    </div>
  );
}

function Tabs() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0" data-name="Tabs">
      <TabButtonBase />
      <TabButtonBase1 />
      <TabButtonBase2 />
    </div>
  );
}

function HorizontalTabs() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Horizontal tabs">
      <div aria-hidden="true" className="absolute border-[#eaecf0] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Tabs />
    </div>
  );
}

function Container() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] items-start px-[32px] py-0 relative w-full">
          <PageHeader />
          <HorizontalTabs />
        </div>
      </div>
    </div>
  );
}

function HeaderSection() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Header section">
      <Container />
    </div>
  );
}

function Image() {
  return (
    <div className="h-[200px] relative shrink-0 w-full" data-name="Image">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage} />
    </div>
  );
}

function LessonTitle() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0" data-name="Lesson Title">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[32px] not-italic relative shrink-0 text-[#101828] text-[18px] text-nowrap whitespace-pre">Course One</p>
    </div>
  );
}

function HeadingAndBadge() {
  return (
    <div className="content-stretch flex gap-[32px] items-center relative shrink-0" data-name="Heading and Badge">
      <LessonTitle />
    </div>
  );
}

function DotsVertical() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="dots-vertical">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="dots-vertical">
          <g id="Icon">
            <path d={svgPaths.p39a1e780} stroke="var(--stroke-0, #475467)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p11974af0} stroke="var(--stroke-0, #475467)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p133c1580} stroke="var(--stroke-0, #475467)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Actions() {
  return (
    <div className="content-stretch flex gap-[12px] items-center justify-end relative shrink-0 w-[105px]" data-name="Actions">
      <DotsVertical />
    </div>
  );
}

function Heading() {
  return (
    <div className="content-center flex flex-wrap gap-[43px] items-center justify-between relative shrink-0 w-full" data-name="Heading">
      <HeadingAndBadge />
      <Actions />
    </div>
  );
}

function TextDescripton() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Text Descripton">
      <p className="font-['Lato:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#475467] text-[16px] w-full">orem ipsum dolor sit amet, consectetur adipis cing elit, sed do eiusmod tempor ...</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex font-['Roboto:Medium',sans-serif] font-medium items-start justify-between leading-[0] relative shrink-0 text-[#344054] text-[14px] text-nowrap w-full">
      <div className="flex flex-col justify-center relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[20px] text-nowrap whitespace-pre">1/3 Modules</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[20px] text-nowrap whitespace-pre">33% Complete</p>
      </div>
    </div>
  );
}

function ProgressBar() {
  return (
    <div className="h-[8px] relative rounded-[8px] shrink-0 w-full" data-name="Progress bar">
      <div className="absolute bg-[#eaecf0] h-[8px] left-0 right-[0.33px] rounded-[4px] top-0" data-name="Background" />
      <div className="absolute bg-[#395192] h-[8px] left-0 right-[80%] rounded-[4px] top-0" data-name="Progress" />
    </div>
  );
}

function ProgressBar1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-end relative shrink-0 w-full" data-name="Progress bar">
      <Frame />
      <ProgressBar />
    </div>
  );
}

function Content12() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Content">
      <Heading />
      <TextDescripton />
      <div className="h-px relative shrink-0 w-full" data-name="Divider">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 334 1">
          <path clipRule="evenodd" d="M333.333 1H0V0H333.333V1Z" fill="var(--fill-0, #EAECF0)" fillRule="evenodd" id="Divider" />
        </svg>
      </div>
      <ProgressBar1 />
    </div>
  );
}

function BlogPostCard() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[20px] grow items-start min-h-px min-w-[300px] relative shrink-0" data-name="Blog post card">
      <Image />
      <Content12 />
    </div>
  );
}

function Image1() {
  return (
    <div className="h-[200px] relative shrink-0 w-full" data-name="Image">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage1} />
    </div>
  );
}

function HeadingAndBadge1() {
  return (
    <div className="content-stretch flex gap-[32px] items-center relative shrink-0" data-name="Heading and Badge">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[32px] not-italic relative shrink-0 text-[#101828] text-[18px] text-nowrap whitespace-pre">Course Two</p>
    </div>
  );
}

function DotsVertical1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="dots-vertical">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="dots-vertical">
          <g id="Icon">
            <path d={svgPaths.p39a1e780} stroke="var(--stroke-0, #475467)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p11974af0} stroke="var(--stroke-0, #475467)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p133c1580} stroke="var(--stroke-0, #475467)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Actions1() {
  return (
    <div className="content-stretch flex gap-[12px] items-center justify-end relative shrink-0 w-[105px]" data-name="Actions">
      <DotsVertical1 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Heading">
      <HeadingAndBadge1 />
      <Actions1 />
    </div>
  );
}

function TextDescripton1() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Text Descripton">
      <p className="font-['Lato:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#475467] text-[16px] w-full">orem ipsum dolor sit amet, consectetur adipis cing elit, sed do eiusmod tempor ...</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex font-['Roboto:Medium',sans-serif] font-medium items-start justify-between leading-[0] relative shrink-0 text-[#344054] text-[14px] text-nowrap w-full">
      <div className="flex flex-col justify-center relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[20px] text-nowrap whitespace-pre">1/3 Modules</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[20px] text-nowrap whitespace-pre">33% Complete</p>
      </div>
    </div>
  );
}

function ProgressBar2() {
  return (
    <div className="h-[8px] relative rounded-[8px] shrink-0 w-full" data-name="Progress bar">
      <div className="absolute bg-[#eaecf0] h-[8px] left-0 right-[0.33px] rounded-[4px] top-0" data-name="Background" />
      <div className="absolute bg-[#395192] h-[8px] left-0 right-[80%] rounded-[4px] top-0" data-name="Progress" />
    </div>
  );
}

function ProgressBar3() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-end relative shrink-0 w-full" data-name="Progress bar">
      <Frame1 />
      <ProgressBar2 />
    </div>
  );
}

function Content13() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Content">
      <Heading1 />
      <TextDescripton1 />
      <div className="h-px relative shrink-0 w-full" data-name="Divider">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 334 1">
          <path clipRule="evenodd" d="M333.333 1H0V0H333.333V1Z" fill="var(--fill-0, #EAECF0)" fillRule="evenodd" id="Divider" />
        </svg>
      </div>
      <ProgressBar3 />
    </div>
  );
}

function BlogPostCard1() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[20px] grow items-start min-h-px min-w-[300px] relative shrink-0" data-name="Blog post card">
      <Image1 />
      <Content13 />
    </div>
  );
}

function Image2() {
  return (
    <div className="h-[200px] relative shrink-0 w-full" data-name="Image">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage2} />
    </div>
  );
}

function HeadingAndBadge2() {
  return (
    <div className="content-stretch flex gap-[32px] items-center relative shrink-0" data-name="Heading and Badge">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[32px] not-italic relative shrink-0 text-[#101828] text-[18px] text-nowrap whitespace-pre">Course Three</p>
    </div>
  );
}

function DotsVertical2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="dots-vertical">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="dots-vertical">
          <g id="Icon">
            <path d={svgPaths.p39a1e780} stroke="var(--stroke-0, #475467)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p11974af0} stroke="var(--stroke-0, #475467)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p133c1580} stroke="var(--stroke-0, #475467)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Actions2() {
  return (
    <div className="content-stretch flex gap-[12px] items-center justify-end relative shrink-0 w-[105px]" data-name="Actions">
      <DotsVertical2 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Heading">
      <HeadingAndBadge2 />
      <Actions2 />
    </div>
  );
}

function TextDescripton2() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Text Descripton">
      <p className="font-['Lato:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#475467] text-[16px] w-full">orem ipsum dolor sit amet, consectetur adipis cing elit, sed do eiusmod tempor ...</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex font-['Roboto:Medium',sans-serif] font-medium items-start justify-between leading-[0] relative shrink-0 text-[#344054] text-[14px] text-nowrap w-full">
      <div className="flex flex-col justify-center relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[20px] text-nowrap whitespace-pre">1/3 Modules</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[20px] text-nowrap whitespace-pre">33% Complete</p>
      </div>
    </div>
  );
}

function ProgressBar4() {
  return (
    <div className="h-[8px] relative rounded-[8px] shrink-0 w-full" data-name="Progress bar">
      <div className="absolute bg-[#eaecf0] h-[8px] left-0 right-[0.33px] rounded-[4px] top-0" data-name="Background" />
      <div className="absolute bg-[#395192] h-[8px] left-0 right-[80%] rounded-[4px] top-0" data-name="Progress" />
    </div>
  );
}

function ProgressBar5() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-end relative shrink-0 w-full" data-name="Progress bar">
      <Frame2 />
      <ProgressBar4 />
    </div>
  );
}

function Content14() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Content">
      <Heading2 />
      <TextDescripton2 />
      <div className="h-px relative shrink-0 w-full" data-name="Divider">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 334 1">
          <path clipRule="evenodd" d="M333.333 1H0V0H333.333V1Z" fill="var(--fill-0, #EAECF0)" fillRule="evenodd" id="Divider" />
        </svg>
      </div>
      <ProgressBar5 />
    </div>
  );
}

function BlogPostCard2() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[20px] grow items-start min-h-px min-w-[300px] relative shrink-0" data-name="Blog post card">
      <Image2 />
      <Content14 />
    </div>
  );
}

function Row() {
  return (
    <div className="content-start flex flex-wrap gap-[32px] items-start justify-center relative shrink-0 w-full" data-name="Row">
      <BlogPostCard />
      <BlogPostCard1 />
      <BlogPostCard2 />
    </div>
  );
}

function Courses() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full" data-name="Courses">
      <Row />
      <div className="h-px relative shrink-0 w-full" data-name="Divider">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1064 1">
          <path clipRule="evenodd" d="M1064 1H0V0H1064V1Z" fill="var(--fill-0, #EAECF0)" fillRule="evenodd" id="Divider" />
        </svg>
      </div>
    </div>
  );
}

function HeadingAndContent() {
  return (
    <div className="content-stretch flex flex-col gap-[22px] items-start relative shrink-0 w-full" data-name="Heading and content">
      <Courses />
    </div>
  );
}

function ArrowDown() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="arrow-down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="arrow-down">
          <path d={svgPaths.p3f155f00} id="Icon" stroke="var(--stroke-0, #6941C6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.67" />
        </g>
      </svg>
    </div>
  );
}

function ButtonBase() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0" data-name="_Button base">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[#6941c6] text-[16px] text-nowrap whitespace-pre">{`Show More `}</p>
      <ArrowDown />
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Button">
      <ButtonBase />
    </div>
  );
}

function Container1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[32px] items-center justify-center px-[32px] py-0 relative w-full">
          <HeadingAndContent />
          <Button />
        </div>
      </div>
    </div>
  );
}

function FeaturesSection() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[64px] items-center overflow-clip pb-[32px] pt-0 px-0 relative shrink-0 w-full" data-name="Features section">
      <Container1 />
    </div>
  );
}

function Main() {
  return (
    <div className="basis-0 bg-white box-border content-stretch flex flex-col gap-[32px] grow h-full items-start min-h-px min-w-px px-0 py-[32px] relative shrink-0" data-name="Main">
      <HeaderSection />
      <FeaturesSection />
    </div>
  );
}

export default function MyCoursesEnrolledCourses() {
  return (
    <div className="bg-white content-stretch flex items-start relative size-full" data-name="My Courses / Enrolled Courses">
      <SidebarNavigation />
      <Main />
    </div>
  );
}