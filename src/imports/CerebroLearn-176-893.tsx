import svgPaths from "./svg-oi1da7kuku";

function Button() {
  return (
    <div className="h-[36px] relative rounded-[10px] shrink-0 w-[79.188px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[16px] py-[8px] relative size-full">
        <p className="font-['Roboto:Medium','Noto_Sans_Symbols:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[#0f172a] text-[14px] text-center text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
          ← Back
        </p>
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex h-[36px] items-start relative shrink-0 w-full" data-name="Heading 1">
      <p className="font-['Roboto:Bold',sans-serif] font-bold leading-[36px] relative shrink-0 text-[#0f172a] text-[30px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Fundamental Physics
      </p>
    </div>
  );
}

function Badge() {
  return (
    <div className="bg-[#395192] h-[22px] relative rounded-[10px] shrink-0 w-[70.32px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit] size-full">
        <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[12px] text-nowrap text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
          published
        </p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Text() {
  return (
    <div className="h-[20px] relative shrink-0 w-[48.953px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#64748b] text-[14px] text-nowrap top-[-0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Science
        </p>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[4.727px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#64748b] text-[14px] text-nowrap top-[-0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          •
        </p>
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[55.047px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#64748b] text-[14px] text-nowrap top-[-0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Beginner
        </p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex gap-[12px] h-[22px] items-center relative shrink-0 w-full" data-name="Container">
      <Badge />
      <Text />
      <Text1 />
      <Text2 />
    </div>
  );
}

function Container1() {
  return (
    <div className="basis-0 grow h-[66px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Heading />
        <Container />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[66px] relative shrink-0 w-[384.18px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Button />
        <Container1 />
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-[13px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p26b72c80} id="Vector" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[36px] relative rounded-[10px] shrink-0 w-[107.578px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon />
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-[70px] text-[#0f172a] text-[14px] text-center text-nowrap top-[7.5px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Preview
        </p>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p3c401780} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p56b0600} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p17caa400} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="basis-0 bg-[#395192] grow h-[36px] min-h-px min-w-px relative rounded-[10px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon1 />
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-[88.5px] text-[14px] text-center text-nowrap text-white top-[7.5px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Save Changes
        </p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[36px] relative shrink-0 w-[264.25px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-start relative size-full">
        <Button1 />
        <Button2 />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex h-[66px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container2 />
      <Container3 />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#64748b] text-[14px] text-nowrap top-[-0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Total Learners
      </p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Bold',sans-serif] font-bold leading-[32px] left-0 text-[#0f172a] text-[24px] text-nowrap top-[-0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        2847
      </p>
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[52px] relative shrink-0 w-[89.188px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph />
        <Paragraph1 />
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Icon">
          <path d={svgPaths.p27a3200} id="Vector" stroke="var(--stroke-0, #2B7FFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
          <path d={svgPaths.p27130800} id="Vector_2" stroke="var(--stroke-0, #2B7FFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
          <path d={svgPaths.p18f42980} id="Vector_3" stroke="var(--stroke-0, #2B7FFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
          <path d={svgPaths.p2ee517c0} id="Vector_4" stroke="var(--stroke-0, #2B7FFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
        </g>
      </svg>
    </div>
  );
}

function CourseManagementPage() {
  return (
    <div className="h-[52px] relative shrink-0 w-[160px]" data-name="CourseManagementPage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">
        <Container5 />
        <Icon2 />
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="[grid-area:1_/_1] bg-white place-self-stretch relative rounded-[16px] shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[rgba(57,81,146,0.1)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
      <div className="size-full">
        <div className="content-stretch flex flex-col items-start pb-px pl-[29px] pr-px pt-[29px] relative size-full">
          <CourseManagementPage />
        </div>
      </div>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#64748b] text-[14px] text-nowrap top-[-0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Avg. Rating
      </p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Bold',sans-serif] font-bold leading-[32px] left-0 text-[#0f172a] text-[24px] text-nowrap top-[-0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        4.7
      </p>
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[52px] relative shrink-0 w-[70.328px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph2 />
        <Paragraph3 />
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Icon">
          <path d={svgPaths.p17051600} id="Vector" stroke="var(--stroke-0, #F0B100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
        </g>
      </svg>
    </div>
  );
}

function CourseManagementPage1() {
  return (
    <div className="h-[52px] relative shrink-0 w-[160px]" data-name="CourseManagementPage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">
        <Container6 />
        <Icon3 />
      </div>
    </div>
  );
}

function Card1() {
  return (
    <div className="[grid-area:1_/_2] bg-white place-self-stretch relative rounded-[16px] shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[rgba(57,81,146,0.1)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
      <div className="size-full">
        <div className="content-stretch flex flex-col items-start pb-px pl-[29px] pr-px pt-[29px] relative size-full">
          <CourseManagementPage1 />
        </div>
      </div>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#64748b] text-[14px] text-nowrap top-[-0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Total Lessons
      </p>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Bold',sans-serif] font-bold leading-[32px] left-0 text-[#0f172a] text-[24px] text-nowrap top-[-0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        6
      </p>
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[52px] relative shrink-0 w-[87.094px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph4 />
        <Paragraph5 />
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Icon">
          <path d="M16 9.33333V28" id="Vector" stroke="var(--stroke-0, #AD46FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
          <path d={svgPaths.p308d0700} id="Vector_2" stroke="var(--stroke-0, #AD46FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
        </g>
      </svg>
    </div>
  );
}

function CourseManagementPage2() {
  return (
    <div className="h-[52px] relative shrink-0 w-[160px]" data-name="CourseManagementPage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">
        <Container7 />
        <Icon4 />
      </div>
    </div>
  );
}

function Card2() {
  return (
    <div className="[grid-area:1_/_3] bg-white place-self-stretch relative rounded-[16px] shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[rgba(57,81,146,0.1)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
      <div className="size-full">
        <div className="content-stretch flex flex-col items-start pb-px pl-[29px] pr-px pt-[29px] relative size-full">
          <CourseManagementPage2 />
        </div>
      </div>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#64748b] text-[14px] text-nowrap top-[-0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Duration
      </p>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Bold',sans-serif] font-bold leading-[32px] left-0 text-[#0f172a] text-[24px] top-[-0.5px] w-[68px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        2h 5m
      </p>
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[52px] relative shrink-0 w-[67.773px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph6 />
        <Paragraph7 />
      </div>
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Icon">
          <path d="M16 8V16L21.3333 18.6667" id="Vector" stroke="var(--stroke-0, #00C950)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
          <path d={svgPaths.p1dee4500} id="Vector_2" stroke="var(--stroke-0, #00C950)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
        </g>
      </svg>
    </div>
  );
}

function CourseManagementPage3() {
  return (
    <div className="h-[52px] relative shrink-0 w-[160px]" data-name="CourseManagementPage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">
        <Container8 />
        <Icon5 />
      </div>
    </div>
  );
}

function Card3() {
  return (
    <div className="[grid-area:1_/_4] bg-white place-self-stretch relative rounded-[16px] shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[rgba(57,81,146,0.1)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
      <div className="size-full">
        <div className="content-stretch flex flex-col items-start pb-px pl-[29px] pr-px pt-[29px] relative size-full">
          <CourseManagementPage3 />
        </div>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="gap-[16px] grid grid-cols-[repeat(4,_minmax(0px,_1fr))] grid-rows-[repeat(1,_minmax(0px,_1fr))] h-[118px] relative shrink-0 w-full" data-name="Container">
      <Card />
      <Card1 />
      <Card2 />
      <Card3 />
    </div>
  );
}

function PrimitiveButton() {
  return (
    <div className="absolute content-stretch flex h-[29px] items-center justify-center left-[3px] px-[9px] py-[5px] rounded-[16px] top-[3.5px] w-[182.797px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[#64748b] text-[14px] text-center text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Overview
      </p>
    </div>
  );
}

function PrimitiveButton1() {
  return (
    <div className="absolute content-stretch flex h-[29px] items-center justify-center left-[185.8px] px-[9px] py-[5px] rounded-[16px] top-[3.5px] w-[182.797px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[#64748b] text-[14px] text-center text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Curriculum
      </p>
    </div>
  );
}

function PrimitiveButton2() {
  return (
    <div className="absolute content-stretch flex h-[29px] items-center justify-center left-[368.59px] px-[9px] py-[5px] rounded-[16px] top-[3.5px] w-[182.805px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[#64748b] text-[14px] text-center text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Learners
      </p>
    </div>
  );
}

function PrimitiveButton3() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] content-stretch flex h-[29px] items-center justify-center left-[551.4px] px-[9px] py-[5px] rounded-[16px] top-[3.5px] w-[182.797px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[#0f172a] text-[14px] text-center text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Reviews
      </p>
    </div>
  );
}

function PrimitiveButton4() {
  return (
    <div className="absolute content-stretch flex h-[29px] items-center justify-center left-[734.2px] px-[9px] py-[5px] rounded-[16px] top-[3.5px] w-[182.805px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[#64748b] text-[14px] text-center text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Settings
      </p>
    </div>
  );
}

function TabList() {
  return (
    <div className="bg-[#f1f5f9] h-[36px] relative rounded-[16px] shrink-0 w-[920px]" data-name="Tab List">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <PrimitiveButton />
        <PrimitiveButton1 />
        <PrimitiveButton2 />
        <PrimitiveButton3 />
        <PrimitiveButton4 />
      </div>
    </div>
  );
}

function CardTitle() {
  return (
    <div className="[grid-area:1_/_1] place-self-stretch relative shrink-0" data-name="CardTitle">
      <p className="absolute font-['Roboto:SemiBold',sans-serif] font-semibold leading-[24px] left-0 text-[#0f172a] text-[24px] text-nowrap top-[-0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Course Reviews
      </p>
    </div>
  );
}

function CardDescription() {
  return (
    <div className="[grid-area:2_/_1] h-[27.195px] justify-self-stretch relative shrink-0" data-name="CardDescription">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[27.2px] left-0 text-[#64748b] text-[16px] top-0 tracking-[0.16px] w-[240px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Average rating: 4.7 ⭐ (3 reviews)
      </p>
    </div>
  );
}

function CardHeader() {
  return (
    <div className="h-[91.195px] relative shrink-0 w-[910px]" data-name="CardHeader">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid gap-[8px] grid grid-cols-[repeat(1,_minmax(0px,_1fr))] grid-rows-[minmax(0px,_24fr)_minmax(0px,_1fr)] pb-0 pt-[32px] px-[32px] relative size-full">
        <CardTitle />
        <CardDescription />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="bg-[rgba(57,81,146,0.1)] relative rounded-[1.67772e+07px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Roboto:Bold',sans-serif] font-bold leading-[24px] relative shrink-0 text-[#395192] text-[16px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
          A
        </p>
      </div>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:SemiBold',sans-serif] font-semibold leading-[24px] left-0 text-[#0f172a] text-[16px] text-nowrap top-[0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Alice Johnson
      </p>
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p1cb7cc00} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pb3a1300} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon8() {
  return (
    <div className="basis-0 grow h-[16px] min-h-px min-w-px relative shrink-0" data-name="Icon">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <div className="absolute inset-[8.33%_8.33%_12.2%_8.33%]" data-name="Vector">
          <div className="absolute inset-[-5.24%_-5%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
              <path d={svgPaths.p1416a00} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="basis-0 grow h-[16px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        {[...Array(2).keys()].map((_, i) => (
          <Icon6 key={i} />
        ))}
        {[...Array(2).keys()].map((_, i) => (
          <Icon7 key={i} />
        ))}
        <Icon8 />
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[70.688px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#64748b] text-[14px] text-nowrap top-[-0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          2024-02-20
        </p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <Container11 />
      <Text3 />
    </div>
  );
}

function Container13() {
  return (
    <div className="basis-0 grow h-[44px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph8 />
        <Container12 />
      </div>
    </div>
  );
}

function CourseManagementPage4() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-[24px] top-[24px] w-[210.688px]" data-name="CourseManagementPage">
      <Container10 />
      <Container13 />
    </div>
  );
}

function CourseManagementPage5() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[80px] w-[788px]" data-name="CourseManagementPage">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#0f172a] text-[14px] text-nowrap top-[-0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Excellent course! Very comprehensive and well-structured.
      </p>
    </div>
  );
}

function Icon9() {
  return (
    <div className="absolute left-[10px] size-[16px] top-[7px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p1bb15080} id="Vector" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border border-[rgba(0,0,0,0)] border-solid h-[32px] left-[24px] rounded-[10px] top-[112px] w-[150.633px]" data-name="Button">
      <Icon9 />
      <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-[89.5px] text-[#0f172a] text-[14px] text-center text-nowrap top-[4.5px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Reply to Review
      </p>
    </div>
  );
}

function CardContent() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[836px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <CourseManagementPage4 />
        <CourseManagementPage5 />
        <Button3 />
      </div>
    </div>
  );
}

function Card4() {
  return (
    <div className="bg-white h-[186px] relative rounded-[16px] shrink-0 w-full" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[rgba(57,81,146,0.1)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
      <div className="size-full">
        <div className="content-stretch flex flex-col items-start pl-[5px] pr-px py-[5px] relative size-full">
          <CardContent />
        </div>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="bg-[rgba(57,81,146,0.1)] relative rounded-[1.67772e+07px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Roboto:Bold',sans-serif] font-bold leading-[24px] relative shrink-0 text-[#395192] text-[16px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
          C
        </p>
      </div>
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:SemiBold',sans-serif] font-semibold leading-[24px] left-0 text-[#0f172a] text-[16px] text-nowrap top-[0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Carol Williams
      </p>
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p1cb7cc00} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pb3a1300} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon12() {
  return (
    <div className="basis-0 grow h-[16px] min-h-px min-w-px relative shrink-0" data-name="Icon">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <div className="absolute inset-[8.33%_8.33%_12.2%_8.33%]" data-name="Vector">
          <div className="absolute inset-[-5.24%_-5%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
              <path d={svgPaths.p1416a00} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="basis-0 grow h-[16px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        {[...Array(2).keys()].map((_, i) => (
          <Icon10 key={i} />
        ))}
        {[...Array(2).keys()].map((_, i) => (
          <Icon11 key={i} />
        ))}
        <Icon12 />
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[20px] relative shrink-0 w-[70.688px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#64748b] text-[14px] text-nowrap top-[-0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          2024-02-18
        </p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <Container15 />
      <Text4 />
    </div>
  );
}

function Container17() {
  return (
    <div className="basis-0 grow h-[44px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph9 />
        <Container16 />
      </div>
    </div>
  );
}

function CourseManagementPage6() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-[24px] top-[24px] w-[210.688px]" data-name="CourseManagementPage">
      <Container14 />
      <Container17 />
    </div>
  );
}

function CourseManagementPage7() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[80px] w-[788px]" data-name="CourseManagementPage">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#0f172a] text-[14px] text-nowrap top-[-0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>{`Best course I've taken. The interactive exercises are amazing.`}</p>
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-0 text-[#0f172a] text-[14px] text-nowrap top-[-0.5px] tracking-[0.14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Your reply:
      </p>
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#0f172a] text-[14px] text-nowrap top-[-0.5px] tracking-[0.14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Thank you for the kind words!
      </p>
    </div>
  );
}

function CourseManagementPage8() {
  return (
    <div className="absolute bg-[#f0f9ff] content-stretch flex flex-col gap-[4px] h-[68px] items-start left-[24px] pb-0 pt-[12px] px-[12px] rounded-[12px] top-[112px] w-[788px]" data-name="CourseManagementPage">
      <Paragraph10 />
      <Paragraph11 />
    </div>
  );
}

function CardContent1() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[836px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <CourseManagementPage6 />
        <CourseManagementPage7 />
        <CourseManagementPage8 />
      </div>
    </div>
  );
}

function Card5() {
  return (
    <div className="bg-white h-[222px] relative rounded-[16px] shrink-0 w-full" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[rgba(57,81,146,0.1)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
      <div className="size-full">
        <div className="content-stretch flex flex-col items-start pl-[5px] pr-px py-[5px] relative size-full">
          <CardContent1 />
        </div>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="bg-[rgba(57,81,146,0.1)] relative rounded-[1.67772e+07px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Roboto:Bold',sans-serif] font-bold leading-[24px] relative shrink-0 text-[#395192] text-[16px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
          B
        </p>
      </div>
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:SemiBold',sans-serif] font-semibold leading-[24px] left-0 text-[#0f172a] text-[16px] text-nowrap top-[0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Bob Smith
      </p>
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p1cb7cc00} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pb3a1300} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon15() {
  return (
    <div className="basis-0 grow h-[16px] min-h-px min-w-px relative shrink-0" data-name="Icon">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <div className="absolute inset-[8.33%_8.33%_12.2%_8.33%]" data-name="Vector">
          <div className="absolute inset-[-5.24%_-5%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
              <path d={svgPaths.p1416a00} id="Vector" stroke="var(--stroke-0, #D1D5DC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="basis-0 grow h-[16px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        {[...Array(2).keys()].map((_, i) => (
          <Icon13 key={i} />
        ))}
        {[...Array(2).keys()].map((_, i) => (
          <Icon14 key={i} />
        ))}
        <Icon15 />
      </div>
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[20px] relative shrink-0 w-[70.688px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#64748b] text-[14px] text-nowrap top-[-0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          2024-02-15
        </p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <Container19 />
      <Text5 />
    </div>
  );
}

function Container21() {
  return (
    <div className="basis-0 grow h-[44px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph12 />
        <Container20 />
      </div>
    </div>
  );
}

function CourseManagementPage9() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[44px] items-center left-[24px] top-[24px] w-[210.688px]" data-name="CourseManagementPage">
      <Container18 />
      <Container21 />
    </div>
  );
}

function CourseManagementPage10() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[80px] w-[788px]" data-name="CourseManagementPage">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#0f172a] text-[14px] text-nowrap top-[-0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Great content, but could use more examples.
      </p>
    </div>
  );
}

function Icon16() {
  return (
    <div className="absolute left-[10px] size-[16px] top-[7px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p1bb15080} id="Vector" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border border-[rgba(0,0,0,0)] border-solid h-[32px] left-[24px] rounded-[10px] top-[112px] w-[150.633px]" data-name="Button">
      <Icon16 />
      <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-[89.5px] text-[#0f172a] text-[14px] text-center text-nowrap top-[4.5px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Reply to Review
      </p>
    </div>
  );
}

function CardContent2() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[836px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <CourseManagementPage9 />
        <CourseManagementPage10 />
        <Button4 />
      </div>
    </div>
  );
}

function Card6() {
  return (
    <div className="bg-white h-[186px] relative rounded-[16px] shrink-0 w-full" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[rgba(57,81,146,0.1)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
      <div className="size-full">
        <div className="content-stretch flex flex-col items-start pl-[5px] pr-px py-[5px] relative size-full">
          <CardContent2 />
        </div>
      </div>
    </div>
  );
}

function CardContent3() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[910px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start px-[32px] py-0 relative size-full">
        <Card4 />
        <Card5 />
        <Card6 />
      </div>
    </div>
  );
}

function Card7() {
  return (
    <div className="basis-0 bg-white grow min-h-px min-w-px relative rounded-[16px] shrink-0 w-[920px]" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[rgba(57,81,146,0.1)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[32px] items-start pl-[5px] pr-px py-[5px] relative size-full">
        <CardHeader />
        <CardContent3 />
      </div>
    </div>
  );
}

function PrimitiveDiv() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[835.195px] items-start relative shrink-0 w-full" data-name="Primitive.div">
      <TabList />
      <Card7 />
    </div>
  );
}

function CourseManagementPage11() {
  return (
    <div className="bg-gradient-to-b from-[#fafbff] h-[1131.195px] relative shrink-0 to-[#fafbff] via-50% via-[rgba(240,249,255,0.3)] w-full" data-name="CourseManagementPage">
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-[24px] items-start pb-0 pt-[32px] px-[64px] relative size-full">
          <Container4 />
          <Container9 />
          <PrimitiveDiv />
        </div>
      </div>
    </div>
  );
}

function Icon17() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d="M12 7V21" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p38e00000} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container22() {
  return (
    <div className="bg-gradient-to-b from-[#395192] relative rounded-[16px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 size-[40px] to-[#06b6d4]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon17 />
      </div>
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[28px] relative shrink-0 w-[122.258px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute bg-clip-text font-['Roboto:Bold',sans-serif] font-bold leading-[28px] left-0 text-[#0f172a] text-[20px] text-nowrap top-[-1px]" style={{ WebkitTextFillColor: "transparent", fontVariationSettings: "'wdth' 100", backgroundImage: "linear-gradient(90deg, rgb(15, 23, 42) 0%, rgb(15, 23, 42) 100%), linear-gradient(167.176deg, rgb(57, 81, 146) 0%, rgb(6, 182, 212) 100%)" }}>
          CerebroLearn
        </p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex gap-[12px] h-[40px] items-center relative shrink-0 w-full" data-name="Container">
      <Container22 />
      <Text6 />
    </div>
  );
}

function Paragraph13() {
  return (
    <div className="h-[78px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[26px] left-0 text-[#64748b] text-[16px] top-[0.5px] w-[334px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Transforming online education with accessible, engaging, and interactive learning experiences. Join thousands of learners worldwide.
      </p>
    </div>
  );
}

function Paragraph14() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[24px] left-0 text-[#0f172a] text-[16px] text-nowrap top-[0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Subscribe to our newsletter
      </p>
    </div>
  );
}

function Input() {
  return (
    <div className="basis-0 bg-[rgba(0,0,0,0)] grow h-[44px] min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[12px] py-[8px] relative size-full">
          <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[14px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            Enter your email
          </p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(57,81,146,0.05)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Icon18() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M3.33333 8H12.6667" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1d405500} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-[#395192] relative rounded-[10px] shrink-0 size-[44px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon18 />
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex gap-[12px] h-[44px] items-start relative shrink-0 w-full" data-name="Container">
      <Input />
      <Button5 />
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[84px] items-start relative shrink-0 w-full" data-name="Container">
      <Paragraph14 />
      <Container24 />
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[32px] h-[266px] items-start left-0 top-0 w-[342.398px]" data-name="Container">
      <Container23 />
      <Paragraph13 />
      <Container25 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Roboto:Bold',sans-serif] font-bold leading-[28px] left-0 text-[#0f172a] text-[18px] text-nowrap top-[0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Explore
      </p>
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute h-[20px] left-0 top-[3px] w-[101.391px]" data-name="Button">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[51px] text-[#64748b] text-[14px] text-center text-nowrap top-[-0.5px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Browse Courses
      </p>
    </div>
  );
}

function ListItem() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Button6 />
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute h-[20px] left-0 top-[3px] w-[76.375px]" data-name="Button">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[38.5px] text-[#64748b] text-[14px] text-center text-nowrap top-[-0.5px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        My Learning
      </p>
    </div>
  );
}

function ListItem1() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Button7 />
    </div>
  );
}

function Button8() {
  return (
    <div className="absolute h-[20px] left-0 top-[3px] w-[78.617px]" data-name="Button">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[39.5px] text-[#64748b] text-[14px] text-center text-nowrap top-[-0.5px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Leaderboard
      </p>
    </div>
  );
}

function ListItem2() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Button8 />
    </div>
  );
}

function Button9() {
  return (
    <div className="absolute h-[20px] left-0 top-[3px] w-[88.266px]" data-name="Button">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[44.5px] text-[#64748b] text-[14px] text-center text-nowrap top-[-0.5px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Achievements
      </p>
    </div>
  );
}

function ListItem3() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Button9 />
    </div>
  );
}

function Button10() {
  return (
    <div className="absolute h-[20px] left-0 top-[3px] w-[67.539px]" data-name="Button">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[34px] text-[#64748b] text-[14px] text-center text-nowrap top-[-0.5px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Instructors
      </p>
    </div>
  );
}

function ListItem4() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Button10 />
    </div>
  );
}

function List() {
  return (
    <div className="content-stretch flex flex-col gap-[14px] h-[176px] items-start relative shrink-0 w-full" data-name="List">
      <ListItem />
      <ListItem1 />
      <ListItem2 />
      <ListItem3 />
      <ListItem4 />
    </div>
  );
}

function Container27() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[32px] h-[266px] items-start left-[406.4px] top-0 w-[139.195px]" data-name="Container">
      <Heading2 />
      <List />
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Roboto:Bold',sans-serif] font-bold leading-[28px] left-0 text-[#0f172a] text-[18px] text-nowrap top-[0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Support
      </p>
    </div>
  );
}

function Button11() {
  return (
    <div className="absolute h-[20px] left-0 top-[3px] w-[73.172px]" data-name="Button">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[37px] text-[#64748b] text-[14px] text-center text-nowrap top-[-0.5px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Help Center
      </p>
    </div>
  );
}

function ListItem5() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Button11 />
    </div>
  );
}

function Button12() {
  return (
    <div className="absolute h-[20px] left-0 top-[3px] w-[68.711px]" data-name="Button">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[34.5px] text-[#64748b] text-[14px] text-center text-nowrap top-[-0.5px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Contact Us
      </p>
    </div>
  );
}

function ListItem6() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Button12 />
    </div>
  );
}

function Button13() {
  return (
    <div className="absolute h-[20px] left-0 top-[3px] w-[86.188px]" data-name="Button">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[43.5px] text-[#64748b] text-[14px] text-center text-nowrap top-[-0.5px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Privacy Policy
      </p>
    </div>
  );
}

function ListItem7() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Button13 />
    </div>
  );
}

function Button14() {
  return (
    <div className="absolute h-[20px] left-0 top-[3px] w-[104.688px]" data-name="Button">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[52.5px] text-[#64748b] text-[14px] text-center text-nowrap top-[-0.5px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Terms of Service
      </p>
    </div>
  );
}

function ListItem8() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Button14 />
    </div>
  );
}

function Button15() {
  return (
    <div className="absolute h-[20px] left-0 top-[3px] w-[78.352px]" data-name="Button">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[39.5px] text-[#64748b] text-[14px] text-center text-nowrap top-[-0.5px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Accessibility
      </p>
    </div>
  );
}

function ListItem9() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Button15 />
    </div>
  );
}

function List1() {
  return (
    <div className="content-stretch flex flex-col gap-[14px] h-[176px] items-start relative shrink-0 w-full" data-name="List">
      <ListItem5 />
      <ListItem6 />
      <ListItem7 />
      <ListItem8 />
      <ListItem9 />
    </div>
  );
}

function Container28() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[32px] h-[266px] items-start left-[609.59px] top-0 w-[139.203px]" data-name="Container">
      <Heading3 />
      <List1 />
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Roboto:Bold',sans-serif] font-bold leading-[28px] left-0 text-[#0f172a] text-[18px] text-nowrap top-[0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Contact
      </p>
    </div>
  );
}

function Icon19() {
  return (
    <div className="absolute left-0 size-[20px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p24d83580} id="Vector" stroke="var(--stroke-0, #395192)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.pd919a80} id="Vector_2" stroke="var(--stroke-0, #395192)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text7() {
  return (
    <div className="absolute h-[20px] left-[32px] top-0 w-[151.945px]" data-name="Text">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#64748b] text-[14px] text-nowrap top-[-0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        hello@cerebrolearn.com
      </p>
    </div>
  );
}

function ListItem10() {
  return (
    <div className="h-[22px] relative shrink-0 w-full" data-name="List Item">
      <Icon19 />
      <Text7 />
    </div>
  );
}

function Icon20() {
  return (
    <div className="absolute left-0 size-[20px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_173_685)" id="Icon">
          <path d={svgPaths.p24c7c480} id="Vector" stroke="var(--stroke-0, #395192)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_173_685">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text8() {
  return (
    <div className="absolute h-[40px] left-[32px] top-0 w-[107.195px]" data-name="Text">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#64748b] text-[14px] top-[-0.5px] w-[84px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        +1 (555) 123-4567
      </p>
    </div>
  );
}

function ListItem11() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="List Item">
      <Icon20 />
      <Text8 />
    </div>
  );
}

function Icon21() {
  return (
    <div className="absolute left-0 size-[20px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p26ddc800} id="Vector" stroke="var(--stroke-0, #395192)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p35ba4680} id="Vector_2" stroke="var(--stroke-0, #395192)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text9() {
  return (
    <div className="absolute h-[40px] left-[32px] top-0 w-[107.195px]" data-name="Text">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#64748b] text-[14px] top-[-0.5px] w-[91px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        San Francisco, CA
      </p>
    </div>
  );
}

function ListItem12() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="List Item">
      <Icon21 />
      <Text9 />
    </div>
  );
}

function List2() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] h-[142px] items-start relative shrink-0 w-full" data-name="List">
      <ListItem10 />
      <ListItem11 />
      <ListItem12 />
    </div>
  );
}

function Container29() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[32px] h-[266px] items-start left-[812.8px] top-0 w-[139.195px]" data-name="Container">
      <Heading4 />
      <List2 />
    </div>
  );
}

function Container30() {
  return (
    <div className="h-[266px] relative shrink-0 w-full" data-name="Container">
      <Container26 />
      <Container27 />
      <Container28 />
      <Container29 />
    </div>
  );
}

function Icon22() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p30c8d680} fill="var(--fill-0, #64748B)" id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button16() {
  return (
    <div className="bg-[#f1f5f9] relative rounded-[1.67772e+07px] shrink-0 size-[44px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon22 />
      </div>
    </div>
  );
}

function Icon23() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p188b5880} fill="var(--fill-0, #64748B)" id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button17() {
  return (
    <div className="bg-[#f1f5f9] relative rounded-[1.67772e+07px] shrink-0 size-[44px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon23 />
      </div>
    </div>
  );
}

function Icon24() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_176_957)" id="Icon">
          <path d={svgPaths.p4b98700} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p29b16f80} id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M14.5833 5.41667H14.5917" id="Vector_3" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_176_957">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button18() {
  return (
    <div className="bg-[#f1f5f9] relative rounded-[1.67772e+07px] shrink-0 size-[44px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon24 />
      </div>
    </div>
  );
}

function Icon25() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1bcdee00} fill="var(--fill-0, #64748B)" id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M5 7.5H1.66667V17.5H5V7.5Z" fill="var(--fill-0, #64748B)" id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p25677470} fill="var(--fill-0, #64748B)" id="Vector_3" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button19() {
  return (
    <div className="bg-[#f1f5f9] relative rounded-[1.67772e+07px] shrink-0 size-[44px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon25 />
      </div>
    </div>
  );
}

function Icon26() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.pd45be00} fill="var(--fill-0, #64748B)" id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p212a8900} fill="var(--fill-0, #64748B)" id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button20() {
  return (
    <div className="basis-0 bg-[#f1f5f9] grow h-[44px] min-h-px min-w-px relative rounded-[1.67772e+07px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon26 />
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="h-[44px] relative shrink-0 w-[300px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[20px] items-center relative size-full">
        <Button16 />
        <Button17 />
        <Button18 />
        <Button19 />
        <Button20 />
      </div>
    </div>
  );
}

function Paragraph15() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#64748b] text-[14px] text-nowrap top-[-0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          © 2025 CerebroLearn Inc. All rights reserved.
        </p>
      </div>
    </div>
  );
}

function Button21() {
  return (
    <div className="h-[20px] relative shrink-0 w-[45.227px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[23px] text-[#64748b] text-[14px] text-center text-nowrap top-[-0.5px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Privacy
        </p>
      </div>
    </div>
  );
}

function Text10() {
  return (
    <div className="h-[24px] relative shrink-0 w-[5.398px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[24px] left-0 text-[#64748b] text-[16px] text-nowrap top-[0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          •
        </p>
      </div>
    </div>
  );
}

function Button22() {
  return (
    <div className="h-[20px] relative shrink-0 w-[39.352px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[20px] text-[#64748b] text-[14px] text-center text-nowrap top-[-0.5px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Terms
        </p>
      </div>
    </div>
  );
}

function Button23() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[25.5px] text-[#64748b] text-[14px] text-center text-nowrap top-[-0.5px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Cookies
        </p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="h-[24px] relative shrink-0 w-[225.609px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[20px] items-center relative size-full">
        <Button21 />
        <Text10 />
        <Button22 />
        <Text10 />
        <Button23 />
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="h-[24px] relative shrink-0 w-[528.289px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[24px] items-center relative size-full">
        <Paragraph15 />
        <Container32 />
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="content-stretch flex h-[44px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container31 />
      <Container33 />
    </div>
  );
}

function Container35() {
  return (
    <div className="content-stretch flex flex-col h-[85px] items-start pb-0 pt-[41px] px-0 relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(57,81,146,0.05)] border-solid inset-0 pointer-events-none" />
      <Container34 />
    </div>
  );
}

function Container36() {
  return (
    <div className="content-stretch flex flex-col gap-[64px] h-[415px] items-start relative shrink-0 w-full" data-name="Container">
      <Container30 />
      <Container35 />
    </div>
  );
}

function Section() {
  return (
    <div className="h-[576px] relative shrink-0 w-full" data-name="Section">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(57,81,146,0.05)] border-solid inset-0 pointer-events-none" />
      <div className="size-full">
        <div className="content-stretch flex flex-col items-start pb-0 pt-[81px] px-[48px] relative size-full">
          <Container36 />
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="content-stretch flex flex-col h-[577px] items-start pb-0 pt-px px-0 relative shrink-0 w-full" data-name="Footer" style={{ backgroundImage: "linear-gradient(151.164deg, rgb(250, 251, 255) 0%, rgba(57, 81, 146, 0.05) 50%, rgba(6, 182, 212, 0.05) 100%)" }}>
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(57,81,146,0.05)] border-solid inset-0 pointer-events-none" />
      <Section />
    </div>
  );
}

function AppContent() {
  return (
    <div className="absolute bg-[#fafbff] content-stretch flex flex-col h-[1789.195px] items-start left-0 pb-0 pl-[300px] pr-0 pt-[81px] top-0 w-[1348px]" data-name="AppContent">
      <CourseManagementPage11 />
      <Footer />
    </div>
  );
}

function Text11() {
  return (
    <div className="absolute h-[24px] left-0 top-[-20000px] w-[8.992px]" data-name="Text">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[24px] left-0 text-[#0f172a] text-[16px] text-nowrap top-[0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        0
      </p>
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Roboto:SemiBold',sans-serif] font-semibold leading-[28px] left-0 text-[#0f172a] text-[18px] text-nowrap top-[0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Course Creator
      </p>
    </div>
  );
}

function Paragraph16() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#64748b] text-[14px] text-nowrap top-[-0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Manage your content
      </p>
    </div>
  );
}

function Container37() {
  return (
    <div className="basis-0 grow h-[48px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Heading1 />
        <Paragraph16 />
      </div>
    </div>
  );
}

function Icon27() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M10 12L6 8L10 4" id="Vector" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button24() {
  return (
    <div className="relative rounded-[12px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon27 />
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="content-stretch flex h-[48px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container37 />
      <Button24 />
    </div>
  );
}

function Icon28() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1fc96a00} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p33089d00} id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p49cfa80} id="Vector_3" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1cfbf300} id="Vector_4" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container39() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-0 text-[#64748b] text-[14px] text-nowrap top-[-0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Dashboard
        </p>
      </div>
    </div>
  );
}

function Button25() {
  return (
    <div className="h-[44px] relative rounded-[12px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[16px] py-0 relative size-full">
          <Icon28 />
          <Container39 />
        </div>
      </div>
    </div>
  );
}

function Icon29() {
  return (
    <div className="relative shrink-0 size-[22px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g id="Icon">
          <path d="M11 6.41667V19.25" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83333" />
          <path d={svgPaths.p2f8e0100} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83333" />
        </g>
      </svg>
    </div>
  );
}

function Container40() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-0 text-[14px] text-nowrap text-white top-[-0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          My Courses
        </p>
      </div>
    </div>
  );
}

function Icon30() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon" opacity="0.500139">
          <path d="M6 12L10 8L6 4" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button26() {
  return (
    <div className="bg-[#395192] h-[44px] relative rounded-[12px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[11px] items-center pl-[15px] pr-[16px] py-0 relative size-full">
          <Icon29 />
          <Container40 />
          <Icon30 />
        </div>
      </div>
    </div>
  );
}

function Icon31() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p140c1100} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M15 14.1667V7.5" id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10.8333 14.1667V4.16667" id="Vector_3" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M6.66667 14.1667V11.6667" id="Vector_4" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container41() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-0 text-[#64748b] text-[14px] text-nowrap top-[-0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Analytics
        </p>
      </div>
    </div>
  );
}

function Button27() {
  return (
    <div className="h-[44px] relative rounded-[12px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[16px] py-0 relative size-full">
          <Icon31 />
          <Container41 />
        </div>
      </div>
    </div>
  );
}

function Icon32() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p25397b80} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p18406864} id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2241fff0} id="Vector_3" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2c4f400} id="Vector_4" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container42() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-0 text-[#64748b] text-[14px] text-nowrap top-[-0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Subscribers
        </p>
      </div>
    </div>
  );
}

function Button28() {
  return (
    <div className="h-[44px] relative rounded-[12px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[16px] py-0 relative size-full">
          <Icon32 />
          <Container42 />
        </div>
      </div>
    </div>
  );
}

function Icon33() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M10 1.66667V18.3333" id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3055a600} id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container43() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-0 text-[#64748b] text-[14px] text-nowrap top-[-0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Revenue
        </p>
      </div>
    </div>
  );
}

function Button29() {
  return (
    <div className="h-[44px] relative rounded-[12px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[16px] py-0 relative size-full">
          <Icon33 />
          <Container43 />
        </div>
      </div>
    </div>
  );
}

function Icon34() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p15ab6200} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3b27f100} id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container44() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-0 text-[#64748b] text-[14px] text-nowrap top-[-0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Settings
        </p>
      </div>
    </div>
  );
}

function Button30() {
  return (
    <div className="h-[44px] relative rounded-[12px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[16px] py-0 relative size-full">
          <Icon34 />
          <Container44 />
        </div>
      </div>
    </div>
  );
}

function Navigation() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[284px] items-start relative shrink-0 w-full" data-name="Navigation">
      <Button25 />
      <Button26 />
      <Button27 />
      <Button28 />
      <Button29 />
      <Button30 />
    </div>
  );
}

function Container45() {
  return (
    <div className="h-[404px] relative shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-[24px] items-start pb-0 pt-[24px] px-[24px] relative size-full">
          <Container38 />
          <Navigation />
        </div>
      </div>
    </div>
  );
}

function CourseCreatorSidebar() {
  return (
    <div className="absolute bg-white h-[922px] left-0 top-[80px] w-[300px]" data-name="CourseCreatorSidebar">
      <div className="content-stretch flex flex-col items-start overflow-clip pl-0 pr-px py-0 relative rounded-[inherit] size-full">
        <Container45 />
      </div>
      <div aria-hidden="true" className="absolute border-[0px_1px_0px_0px] border-[rgba(57,81,146,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon35() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M10 5.83333V17.5" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p25713000} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container46() {
  return (
    <div className="bg-gradient-to-b from-[#395192] relative rounded-[16px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 size-[36px] to-[#06b6d4]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon35 />
      </div>
    </div>
  );
}

function Text12() {
  return (
    <div className="basis-0 grow h-[28px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute bg-clip-text font-['Roboto:Bold',sans-serif] font-bold leading-[28px] left-[55.5px] text-[18px] text-[rgba(0,0,0,0)] text-center text-nowrap top-[0.5px] translate-x-[-50%]" style={{ WebkitTextFillColor: "transparent", fontVariationSettings: "'wdth' 100", backgroundImage: "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(rgb(57, 81, 146) 0%, rgb(6, 182, 212) 100%)" }}>
          CerebroLearn
        </p>
      </div>
    </div>
  );
}

function Button31() {
  return (
    <div className="h-[36px] relative shrink-0 w-[158.031px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container46 />
        <Text12 />
      </div>
    </div>
  );
}

function Button32() {
  return (
    <div className="h-[40px] relative rounded-[12px] shrink-0 w-[107.75px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-[54px] text-[#64748b] text-[14px] text-center text-nowrap top-[9.5px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Dashboard
        </p>
      </div>
    </div>
  );
}

function Button33() {
  return (
    <div className="h-[40px] relative rounded-[12px] shrink-0 w-[91.734px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-[46px] text-[#64748b] text-[14px] text-center text-nowrap top-[9.5px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Courses
        </p>
      </div>
    </div>
  );
}

function Button34() {
  return (
    <div className="basis-0 grow h-[40px] min-h-px min-w-px relative rounded-[12px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-[60px] text-[#64748b] text-[14px] text-center text-nowrap top-[9.5px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Leaderboard
        </p>
      </div>
    </div>
  );
}

function Container47() {
  return (
    <div className="basis-0 grow h-[40px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Button32 />
        <Button33 />
        <Button34 />
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="h-[40px] relative shrink-0 w-[540.531px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[48px] items-center relative size-full">
        <Button31 />
        <Container47 />
      </div>
    </div>
  );
}

function Icon36() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p21a85400} id="Vector" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button35() {
  return (
    <div className="relative rounded-[1.67772e+07px] shrink-0 size-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon36 />
      </div>
    </div>
  );
}

function Icon37() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_173_645)" id="Icon">
          <path d={svgPaths.p23166800} id="Vector" stroke="var(--stroke-0, #F0B100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1a3c1838} id="Vector_2" stroke="var(--stroke-0, #F0B100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1b84be20} id="Vector_3" stroke="var(--stroke-0, #F0B100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2.66667 14.6667H13.3333" id="Vector_4" stroke="var(--stroke-0, #F0B100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1c3dcc70} id="Vector_5" stroke="var(--stroke-0, #F0B100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p30052a00} id="Vector_6" stroke="var(--stroke-0, #F0B100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_173_645">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text13() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-0 text-[#0f172a] text-[14px] top-[-0.5px] w-[54px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          1250 XP
        </p>
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="absolute bg-gradient-to-r content-stretch flex from-[rgba(173,70,255,0.1)] gap-[8px] h-[34px] items-center left-0 px-[13px] py-px rounded-[1.67772e+07px] to-[rgba(246,51,154,0.1)] top-[3px] w-[103.094px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(57,81,146,0.1)] border-solid inset-0 pointer-events-none rounded-[1.67772e+07px]" />
      <Icon37 />
      <Text13 />
    </div>
  );
}

function Text14() {
  return (
    <div className="basis-0 bg-[#f1f5f9] grow h-[40px] min-h-px min-w-px relative rounded-[1.67772e+07px] shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[#0f172a] text-[14px] text-center text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
          D
        </p>
      </div>
    </div>
  );
}

function PrimitiveSpan() {
  return (
    <div className="absolute content-stretch flex items-start left-0 overflow-clip rounded-[1.67772e+07px] size-[40px] top-0" data-name="Primitive.span">
      <Text14 />
    </div>
  );
}

function Button36() {
  return (
    <div className="absolute left-[115.09px] rounded-[1.67772e+07px] size-[40px] top-0" data-name="Button">
      <PrimitiveSpan />
    </div>
  );
}

function Container50() {
  return (
    <div className="basis-0 grow h-[40px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container49 />
        <Button36 />
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="h-[40px] relative shrink-0 w-[211.094px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[20px] items-center relative size-full">
        <Button35 />
        <Container50 />
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="h-[80px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[48px] py-0 relative size-full">
          <Container48 />
          <Container51 />
        </div>
      </div>
    </div>
  );
}

function Navbar() {
  return (
    <div className="absolute bg-[rgba(250,251,255,0.6)] content-stretch flex flex-col h-[81px] items-start left-0 pb-px pt-0 px-0 top-0 w-[1348px]" data-name="Navbar">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(57,81,146,0.05)] border-solid inset-0 pointer-events-none shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
      <Container52 />
    </div>
  );
}

export default function CerebroLearn() {
  return (
    <div className="bg-[#fafbff] relative size-full" data-name="CerebroLearn">
      <AppContent />
      <Text11 />
      <CourseCreatorSidebar />
      <Navbar />
    </div>
  );
}