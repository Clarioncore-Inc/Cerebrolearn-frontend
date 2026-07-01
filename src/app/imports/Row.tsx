import svgPaths from "./svg-1fzm63qep0";
import imgImage from "figma:asset/9f6a821de8d880fb6c07b24d439df1dca1588862.png";
import imgImage1 from "figma:asset/aa0e63b4b72dafa20ebf705cb3408f9d3a4343ef.png";
import imgImage2 from "figma:asset/908f6e6dadefff9c6fad99774e0aa7808b2270ab.png";

function HeartRounded() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="heart-rounded">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="heart-rounded">
          <path d={svgPaths.p3ee4d200} id="Icon" stroke="var(--stroke-0, #052D69)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.39831" />
        </g>
      </svg>
    </div>
  );
}

function SubTopicCard() {
  return (
    <div className="content-stretch flex gap-[6px] items-center justify-center overflow-clip relative shrink-0" data-name="Sub Topic Card">
      <HeartRounded />
      <p className="font-['Roboto:SemiBold',sans-serif] font-semibold leading-[16.78px] relative shrink-0 text-[#052d69] text-[11.746px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        50
      </p>
    </div>
  );
}

function LikeButtons() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Like Buttons">
      <SubTopicCard />
    </div>
  );
}

function Share2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="share-07">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="share-07">
          <path d={svgPaths.p298f6900} id="Icon" stroke="var(--stroke-0, #052D69)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.39831" />
        </g>
      </svg>
    </div>
  );
}

function SubTopicCard1() {
  return (
    <div className="content-stretch flex gap-[5.034px] items-center justify-center overflow-clip relative shrink-0" data-name="Sub Topic Card">
      <Share2 />
      <p className="font-['Roboto:SemiBold',sans-serif] font-semibold leading-[16.78px] relative shrink-0 text-[#052d69] text-[11.746px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        50
      </p>
    </div>
  );
}

function LikeAndShareActions() {
  return (
    <div className="absolute backdrop-blur-[4.195px] backdrop-filter bg-[rgba(255,255,255,0.6)] box-border content-stretch flex gap-[10.068px] items-center left-[272px] p-[6.712px] rounded-[10.068px] shadow-[0px_4px_10px_0px_rgba(0,0,0,0.2)] top-[13px]" data-name="Like and Share Actions">
      <LikeButtons />
      <SubTopicCard1 />
    </div>
  );
}

function Image() {
  return (
    <div className="h-[240px] overflow-clip relative rounded-[8px] shrink-0 w-full" data-name="Image">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[8px] size-full" src={imgImage} />
      <LikeAndShareActions />
    </div>
  );
}

function Header() {
  return (
    <div className="content-stretch flex font-['Roboto:SemiBold',sans-serif] font-semibold gap-[10px] items-center justify-center relative shrink-0 w-full" data-name="Header">
      <p className="basis-0 grow leading-[20px] min-h-px min-w-px relative shrink-0 text-[#052d69] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Coordinator • Alec Whitten
      </p>
      <p className="basis-0 grow leading-[24px] min-h-px min-w-px relative shrink-0 text-[#344054] text-[16px] text-right" style={{ fontVariationSettings: "'wdth' 100" }}>
        Ghc 450.00
      </p>
    </div>
  );
}

function ArrowUpRight() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="arrow-up-right">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="arrow-up-right">
          <path d="M7 17L17 7M17 7H7M17 7V17" id="Icon" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconWrap() {
  return (
    <div className="box-border content-stretch flex flex-col items-start pb-0 pt-[4px] px-0 relative shrink-0" data-name="Icon wrap">
      <ArrowUpRight />
    </div>
  );
}

function HeadingAndIcon() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="Heading and icon">
      <p className="basis-0 font-['Inter:Semi_Bold',sans-serif] font-semibold grow leading-[32px] min-h-px min-w-px not-italic relative shrink-0 text-[#101828] text-[24px]">Program One</p>
      <IconWrap />
    </div>
  );
}

function HeadingAndText() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Heading and text">
      <Header />
      <HeadingAndIcon />
      <p className="-webkit-box font-['Roboto:Regular',sans-serif] font-normal leading-[24px] overflow-ellipsis overflow-hidden relative shrink-0 text-[#475467] text-[16px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun torem ...
      </p>
    </div>
  );
}

function BookmarkAdd() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="bookmark-add">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_62_1710)" id="bookmark-add">
          <path d={svgPaths.p308ce580} id="Icon" stroke="var(--stroke-0, #344054)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_62_1710">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function TextPadding() {
  return (
    <div className="box-border content-stretch flex items-center justify-center px-[2px] py-0 relative shrink-0" data-name="Text padding">
      <p className="font-['Roboto:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[#344054] text-[14px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Add to Wishlist
      </p>
    </div>
  );
}

function SubTopicCard2() {
  return (
    <div className="basis-0 bg-white grow min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Sub Topic Card">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[4px] items-center justify-center px-[14px] py-[10px] relative w-full">
          <BookmarkAdd />
          <TextPadding />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]" />
    </div>
  );
}

function UserCheck2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="user-check-01">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_62_1701)" id="user-check-01">
          <path d={svgPaths.p2cd13000} id="Icon" stroke="var(--stroke-0, #052D69)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_62_1701">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function TextPadding1() {
  return (
    <div className="box-border content-stretch flex items-center justify-center px-[2px] py-0 relative shrink-0" data-name="Text padding">
      <p className="font-['Roboto:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[#052d69] text-[14px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Subscribe
      </p>
    </div>
  );
}

function SubTopicCard3() {
  return (
    <div className="basis-0 bg-white grow min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Sub Topic Card">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[4px] items-center justify-center px-[14px] py-[10px] relative w-full">
          <UserCheck2 />
          <TextPadding1 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#bdcdff] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]" />
    </div>
  );
}

function Actions() {
  return (
    <div className="content-stretch flex gap-[12px] h-[40px] items-center relative shrink-0 w-[384px]" data-name="Actions">
      <SubTopicCard2 />
      <SubTopicCard3 />
    </div>
  );
}

function Content() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Content">
      <HeadingAndText />
      <Actions />
    </div>
  );
}

function CouseItem() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[16px] grow items-start min-h-px min-w-px relative shrink-0" data-name="Couse Item">
      <Image />
      <Content />
    </div>
  );
}

function HeartRounded1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="heart-rounded">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="heart-rounded">
          <path d={svgPaths.p3ee4d200} id="Icon" stroke="var(--stroke-0, #052D69)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.39831" />
        </g>
      </svg>
    </div>
  );
}

function SubTopicCard4() {
  return (
    <div className="content-stretch flex gap-[6px] items-center justify-center overflow-clip relative shrink-0" data-name="Sub Topic Card">
      <HeartRounded1 />
      <p className="font-['Roboto:SemiBold',sans-serif] font-semibold leading-[16.78px] relative shrink-0 text-[#052d69] text-[11.746px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        50
      </p>
    </div>
  );
}

function LikeButtons1() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Like Buttons">
      <SubTopicCard4 />
    </div>
  );
}

function Share() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="share-07">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="share-07">
          <path d={svgPaths.p298f6900} id="Icon" stroke="var(--stroke-0, #052D69)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.39831" />
        </g>
      </svg>
    </div>
  );
}

function SubTopicCard5() {
  return (
    <div className="content-stretch flex gap-[5.034px] items-center justify-center overflow-clip relative shrink-0" data-name="Sub Topic Card">
      <Share />
      <p className="font-['Roboto:SemiBold',sans-serif] font-semibold leading-[16.78px] relative shrink-0 text-[#052d69] text-[11.746px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        50
      </p>
    </div>
  );
}

function LikeAndShareActions1() {
  return (
    <div className="absolute backdrop-blur-[4.195px] backdrop-filter bg-[rgba(255,255,255,0.85)] box-border content-stretch flex gap-[10.068px] items-center left-[269px] p-[6.712px] rounded-[10.068px] shadow-[0px_4px_10px_0px_rgba(0,0,0,0.2)] top-[13px]" data-name="Like and Share Actions">
      <LikeButtons1 />
      <SubTopicCard5 />
    </div>
  );
}

function Image1() {
  return (
    <div className="h-[240px] overflow-clip relative rounded-[8px] shrink-0 w-full" data-name="Image">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[8px] size-full" src={imgImage1} />
      <LikeAndShareActions1 />
    </div>
  );
}

function Header1() {
  return (
    <div className="content-stretch flex font-['Roboto:SemiBold',sans-serif] font-semibold gap-[10px] items-center justify-center relative shrink-0 w-full" data-name="Header">
      <p className="basis-0 grow leading-[20px] min-h-px min-w-px relative shrink-0 text-[#052d69] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Coordinator • Alec Whitten
      </p>
      <p className="basis-0 grow leading-[24px] min-h-px min-w-px relative shrink-0 text-[#344054] text-[16px] text-right" style={{ fontVariationSettings: "'wdth' 100" }}>
        Ghc 450.00
      </p>
    </div>
  );
}

function ArrowUpRight1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="arrow-up-right">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="arrow-up-right">
          <path d="M7 17L17 7M17 7H7M17 7V17" id="Icon" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconWrap1() {
  return (
    <div className="box-border content-stretch flex flex-col items-start pb-0 pt-[4px] px-0 relative shrink-0" data-name="Icon wrap">
      <ArrowUpRight1 />
    </div>
  );
}

function HeadingAndIcon1() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="Heading and icon">
      <p className="basis-0 font-['Inter:Semi_Bold',sans-serif] font-semibold grow leading-[32px] min-h-px min-w-px not-italic relative shrink-0 text-[#101828] text-[24px]">Program One</p>
      <IconWrap1 />
    </div>
  );
}

function HeadingAndText1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Heading and text">
      <Header1 />
      <HeadingAndIcon1 />
      <p className="-webkit-box font-['Roboto:Regular',sans-serif] font-normal leading-[24px] overflow-ellipsis overflow-hidden relative shrink-0 text-[#475467] text-[16px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun torem ...
      </p>
    </div>
  );
}

function BookmarkAdd1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="bookmark-add">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_62_1710)" id="bookmark-add">
          <path d={svgPaths.p308ce580} id="Icon" stroke="var(--stroke-0, #344054)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_62_1710">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function TextPadding2() {
  return (
    <div className="box-border content-stretch flex items-center justify-center px-[2px] py-0 relative shrink-0" data-name="Text padding">
      <p className="font-['Roboto:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[#344054] text-[14px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Add to Wishlist
      </p>
    </div>
  );
}

function SubTopicCard6() {
  return (
    <div className="basis-0 bg-white grow min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Sub Topic Card">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[4px] items-center justify-center px-[14px] py-[10px] relative w-full">
          <BookmarkAdd1 />
          <TextPadding2 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]" />
    </div>
  );
}

function UserCheck() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="user-check-01">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_62_1701)" id="user-check-01">
          <path d={svgPaths.p2cd13000} id="Icon" stroke="var(--stroke-0, #052D69)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_62_1701">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function TextPadding3() {
  return (
    <div className="box-border content-stretch flex items-center justify-center px-[2px] py-0 relative shrink-0" data-name="Text padding">
      <p className="font-['Roboto:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[#052d69] text-[14px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Subscribe
      </p>
    </div>
  );
}

function SubTopicCard7() {
  return (
    <div className="basis-0 bg-white grow min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Sub Topic Card">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[4px] items-center justify-center px-[14px] py-[10px] relative w-full">
          <UserCheck />
          <TextPadding3 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#bdcdff] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]" />
    </div>
  );
}

function Actions1() {
  return (
    <div className="content-stretch flex gap-[12px] h-[40px] items-center relative shrink-0 w-[384px]" data-name="Actions">
      <SubTopicCard6 />
      <SubTopicCard7 />
    </div>
  );
}

function Content1() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Content">
      <HeadingAndText1 />
      <Actions1 />
    </div>
  );
}

function CouseItem1() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[16px] grow items-start min-h-px min-w-px relative shrink-0" data-name="Couse Item">
      <Image1 />
      <Content1 />
    </div>
  );
}

function HeartRounded2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="heart-rounded">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="heart-rounded">
          <path d={svgPaths.p3ee4d200} id="Icon" stroke="var(--stroke-0, #052D69)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.39831" />
        </g>
      </svg>
    </div>
  );
}

function SubTopicCard8() {
  return (
    <div className="content-stretch flex gap-[6px] items-center justify-center overflow-clip relative shrink-0" data-name="Sub Topic Card">
      <HeartRounded2 />
      <p className="font-['Roboto:SemiBold',sans-serif] font-semibold leading-[16.78px] relative shrink-0 text-[#052d69] text-[11.746px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        50
      </p>
    </div>
  );
}

function LikeButtons2() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Like Buttons">
      <SubTopicCard8 />
    </div>
  );
}

function Share1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="share-07">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="share-07">
          <path d={svgPaths.p298f6900} id="Icon" stroke="var(--stroke-0, #052D69)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.39831" />
        </g>
      </svg>
    </div>
  );
}

function SubTopicCard9() {
  return (
    <div className="content-stretch flex gap-[5.034px] items-center justify-center overflow-clip relative shrink-0" data-name="Sub Topic Card">
      <Share1 />
      <p className="font-['Roboto:SemiBold',sans-serif] font-semibold leading-[16.78px] relative shrink-0 text-[#052d69] text-[11.746px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        50
      </p>
    </div>
  );
}

function LikeAndShareActions2() {
  return (
    <div className="absolute backdrop-blur-[4.195px] backdrop-filter bg-[rgba(255,255,255,0.85)] box-border content-stretch flex gap-[10.068px] items-center left-[269px] p-[6.712px] rounded-[10.068px] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.25)] top-[13px]" data-name="Like and Share Actions">
      <LikeButtons2 />
      <SubTopicCard9 />
    </div>
  );
}

function Image2() {
  return (
    <div className="h-[240px] overflow-clip relative rounded-[8px] shrink-0 w-full" data-name="Image">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[8px] size-full" src={imgImage2} />
      <LikeAndShareActions2 />
    </div>
  );
}

function Header2() {
  return (
    <div className="content-stretch flex font-['Roboto:SemiBold',sans-serif] font-semibold gap-[10px] items-center justify-center relative shrink-0 w-full" data-name="Header">
      <p className="basis-0 grow leading-[20px] min-h-px min-w-px relative shrink-0 text-[#052d69] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Coordinator • Alec Whitten
      </p>
      <p className="basis-0 grow leading-[24px] min-h-px min-w-px relative shrink-0 text-[#344054] text-[16px] text-right" style={{ fontVariationSettings: "'wdth' 100" }}>
        Ghc 450.00
      </p>
    </div>
  );
}

function ArrowUpRight2() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="arrow-up-right">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="arrow-up-right">
          <path d="M7 17L17 7M17 7H7M17 7V17" id="Icon" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconWrap2() {
  return (
    <div className="box-border content-stretch flex flex-col items-start pb-0 pt-[4px] px-0 relative shrink-0" data-name="Icon wrap">
      <ArrowUpRight2 />
    </div>
  );
}

function HeadingAndIcon2() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="Heading and icon">
      <p className="basis-0 font-['Inter:Semi_Bold',sans-serif] font-semibold grow leading-[32px] min-h-px min-w-px not-italic relative shrink-0 text-[#101828] text-[24px]">Program One</p>
      <IconWrap2 />
    </div>
  );
}

function HeadingAndText2() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Heading and text">
      <Header2 />
      <HeadingAndIcon2 />
      <p className="-webkit-box font-['Roboto:Regular',sans-serif] font-normal leading-[24px] overflow-ellipsis overflow-hidden relative shrink-0 text-[#475467] text-[16px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun torem ...
      </p>
    </div>
  );
}

function BookmarkAdd2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="bookmark-add">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_62_1710)" id="bookmark-add">
          <path d={svgPaths.p308ce580} id="Icon" stroke="var(--stroke-0, #344054)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_62_1710">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function TextPadding4() {
  return (
    <div className="box-border content-stretch flex items-center justify-center px-[2px] py-0 relative shrink-0" data-name="Text padding">
      <p className="font-['Roboto:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[#344054] text-[14px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Add to Wishlist
      </p>
    </div>
  );
}

function SubTopicCard10() {
  return (
    <div className="basis-0 bg-white grow min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Sub Topic Card">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[4px] items-center justify-center px-[14px] py-[10px] relative w-full">
          <BookmarkAdd2 />
          <TextPadding4 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]" />
    </div>
  );
}

function UserCheck1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="user-check-01">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_62_1701)" id="user-check-01">
          <path d={svgPaths.p2cd13000} id="Icon" stroke="var(--stroke-0, #052D69)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_62_1701">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function TextPadding5() {
  return (
    <div className="box-border content-stretch flex items-center justify-center px-[2px] py-0 relative shrink-0" data-name="Text padding">
      <p className="font-['Roboto:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[#052d69] text-[14px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Subscribe
      </p>
    </div>
  );
}

function SubTopicCard11() {
  return (
    <div className="basis-0 bg-white grow min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Sub Topic Card">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[4px] items-center justify-center px-[14px] py-[10px] relative w-full">
          <UserCheck1 />
          <TextPadding5 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#bdcdff] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]" />
    </div>
  );
}

function Actions2() {
  return (
    <div className="content-stretch flex gap-[12px] h-[40px] items-center relative shrink-0 w-[384px]" data-name="Actions">
      <SubTopicCard10 />
      <SubTopicCard11 />
    </div>
  );
}

function Content2() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Content">
      <HeadingAndText2 />
      <Actions2 />
    </div>
  );
}

function CouseItem2() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[16px] grow items-start min-h-px min-w-px relative shrink-0" data-name="Couse Item">
      <Image2 />
      <Content2 />
    </div>
  );
}

export default function Row() {
  return (
    <div className="content-stretch flex gap-[32px] items-start justify-center relative size-full" data-name="Row">
      <CouseItem />
      <CouseItem1 />
      <CouseItem2 />
    </div>
  );
}