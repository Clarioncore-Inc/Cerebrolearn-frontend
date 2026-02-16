import svgPaths from "./svg-3prgigshwm";

function Button() {
  return (
    <div className="h-[36px] relative rounded-[10px] shrink-0 w-[78.563px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex h-[36px] items-center justify-center px-[16px] py-[8px] relative w-[78.563px]">
        <p className="font-['Roboto:Medium','Noto_Sans_Symbols:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[14px] text-center text-nowrap text-slate-900 whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          ← Back
        </p>
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute font-['Roboto:Bold',sans-serif] font-bold leading-[36px] left-0 text-[30px] text-nowrap text-slate-900 top-[-1px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Data Science with Python
      </p>
    </div>
  );
}

function Badge() {
  return (
    <div className="bg-[#395192] h-[22px] relative rounded-[10px] shrink-0 w-[70.313px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex h-[22px] items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit] w-[70.313px]">
        <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[12px] text-nowrap text-white whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          published
        </p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Text() {
  return (
    <div className="h-[20px] relative shrink-0 w-[71.734px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[20px] relative w-[71.734px]">
        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[14px] text-nowrap text-slate-500 top-[-1px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          Technology
        </p>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[4.734px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[20px] relative w-[4.734px]">
        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[14px] text-nowrap text-slate-500 top-[-1px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          •
        </p>
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[78.922px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[20px] relative w-[78.922px]">
        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[14px] text-nowrap text-slate-500 top-[-1px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          Intermediate
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
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] h-[66px] items-start relative w-full">
        <Heading />
        <Container />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[66px] relative shrink-0 w-[437.875px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] h-[66px] items-center relative w-[437.875px]">
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
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[36px] relative w-[107.578px]">
        <Icon />
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-[70px] text-[14px] text-center text-nowrap text-slate-900 top-[7px] translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
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
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[36px] relative w-full">
        <Icon1 />
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-[88.5px] text-[14px] text-center text-nowrap text-white top-[7px] translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          Save Changes
        </p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[36px] relative shrink-0 w-[264.234px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] h-[36px] items-start relative w-[264.234px]">
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
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[14px] text-nowrap text-slate-500 top-[-1px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Total Learners
      </p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Bold',sans-serif] font-bold leading-[32px] left-0 text-[24px] text-nowrap text-slate-900 top-[-1px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        892
      </p>
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[52px] relative shrink-0 w-[89.188px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col h-[52px] items-start relative w-[89.188px]">
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
    <div className="h-[52px] relative shrink-0 w-[179.25px]" data-name="CourseManagementPage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex h-[52px] items-center justify-between relative w-[179.25px]">
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
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[14px] text-nowrap text-slate-500 top-[-1px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Avg. Rating
      </p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Bold',sans-serif] font-bold leading-[32px] left-0 text-[24px] text-nowrap text-slate-900 top-[-1px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        4.7
      </p>
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[52px] relative shrink-0 w-[70.328px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col h-[52px] items-start relative w-[70.328px]">
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
    <div className="h-[52px] relative shrink-0 w-[179.25px]" data-name="CourseManagementPage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex h-[52px] items-center justify-between relative w-[179.25px]">
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
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[14px] text-nowrap text-slate-500 top-[-1px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Total Lessons
      </p>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Bold',sans-serif] font-bold leading-[32px] left-0 text-[24px] text-nowrap text-slate-900 top-[-1px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        6
      </p>
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[52px] relative shrink-0 w-[87.094px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col h-[52px] items-start relative w-[87.094px]">
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
    <div className="h-[52px] relative shrink-0 w-[179.25px]" data-name="CourseManagementPage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex h-[52px] items-center justify-between relative w-[179.25px]">
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
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[14px] text-nowrap text-slate-500 top-[-1px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Duration
      </p>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Bold',sans-serif] font-bold leading-[32px] left-0 text-[24px] text-slate-900 top-[-1px] w-[68px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        2h 5m
      </p>
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[52px] relative shrink-0 w-[67.766px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col h-[52px] items-start relative w-[67.766px]">
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
    <div className="h-[52px] relative shrink-0 w-[179.25px]" data-name="CourseManagementPage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex h-[52px] items-center justify-between relative w-[179.25px]">
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
    <div className="absolute content-stretch flex h-[29px] items-center justify-center left-[3px] px-[9px] py-[5px] rounded-[16px] top-[3.5px] w-[198.188px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[14px] text-center text-nowrap text-slate-500 whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Overview
      </p>
    </div>
  );
}

function PrimitiveButton1() {
  return (
    <div className="absolute content-stretch flex h-[29px] items-center justify-center left-[201.19px] px-[9px] py-[5px] rounded-[16px] top-[3.5px] w-[198.203px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[14px] text-center text-nowrap text-slate-500 whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Curriculum
      </p>
    </div>
  );
}

function PrimitiveButton2() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] content-stretch flex h-[29px] items-center justify-center left-[399.39px] px-[9px] py-[5px] rounded-[16px] top-[3.5px] w-[198.203px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[14px] text-center text-nowrap text-slate-900 whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Learners
      </p>
    </div>
  );
}

function PrimitiveButton3() {
  return (
    <div className="absolute content-stretch flex h-[29px] items-center justify-center left-[597.59px] px-[9px] py-[5px] rounded-[16px] top-[3.5px] w-[198.203px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[14px] text-center text-nowrap text-slate-500 whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Reviews
      </p>
    </div>
  );
}

function PrimitiveButton4() {
  return (
    <div className="absolute content-stretch flex h-[29px] items-center justify-center left-[795.8px] px-[9px] py-[5px] rounded-[16px] top-[3.5px] w-[198.188px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[14px] text-center text-nowrap text-slate-500 whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Settings
      </p>
    </div>
  );
}

function TabList() {
  return (
    <div className="bg-slate-100 h-[36px] relative rounded-[16px] shrink-0 w-[997px]" data-name="Tab List">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[36px] relative w-[997px]">
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
    <div className="h-[24px] relative shrink-0 w-full" data-name="CardTitle">
      <p className="absolute font-['Roboto:SemiBold',sans-serif] font-semibold leading-[24px] left-0 text-[24px] text-nowrap text-slate-900 top-[-1px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Enrolled Learners
      </p>
    </div>
  );
}

function CardDescription() {
  return (
    <div className="h-[27.188px] relative shrink-0 w-full" data-name="CardDescription">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[27.2px] left-0 text-[16px] text-slate-500 top-0 tracking-[0.16px] w-[202px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        0 learners currently enrolled
      </p>
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[51.188px] relative shrink-0 w-[201.953px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col h-[51.188px] items-start relative w-[201.953px]">
        <CardTitle />
        <CardDescription />
      </div>
    </div>
  );
}

function Icon6() {
  return (
    <div className="absolute left-[13px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M8 10V2" id="Vector" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p23ad1400} id="Vector_2" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p19411800} id="Vector_3" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[36px] relative rounded-[10px] shrink-0 w-[128.859px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[36px] relative w-[128.859px]">
        <Icon6 />
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-[80.5px] text-[14px] text-center text-nowrap text-slate-900 top-[7px] translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          Export CSV
        </p>
      </div>
    </div>
  );
}

function CourseManagementPage4() {
  return (
    <div className="h-[51.188px] relative shrink-0 w-[923px]" data-name="CourseManagementPage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex h-[51.188px] items-center justify-between relative w-[923px]">
        <Container10 />
        <Button3 />
      </div>
    </div>
  );
}

function Icon7() {
  return (
    <div className="absolute left-[429.5px] size-[64px] top-[48px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 64">
        <g id="Icon">
          <path d={svgPaths.p15dee0a0} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" strokeWidth="5.33333" />
          <path d={svgPaths.p11acb900} id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" strokeWidth="5.33333" />
          <path d={svgPaths.p337f6c7e} id="Vector_3" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" strokeWidth="5.33333" />
          <path d={svgPaths.p1c989f00} id="Vector_4" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" strokeWidth="5.33333" />
        </g>
      </svg>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="absolute h-[28px] left-0 top-[128px] w-[923px]" data-name="Paragraph">
      <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[28px] left-[461.84px] text-[18px] text-center text-nowrap text-slate-500 top-0 translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        No learners enrolled yet
      </p>
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="absolute h-[20px] left-0 top-[160px] w-[923px]" data-name="Paragraph">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[461.73px] text-[14px] text-center text-nowrap text-slate-500 top-[-1px] translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Learners will appear here once they enroll in your course
      </p>
    </div>
  );
}

function CourseManagementPage5() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[923px]" data-name="CourseManagementPage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-full relative w-[923px]">
        <Icon7 />
        <Paragraph8 />
        <Paragraph9 />
      </div>
    </div>
  );
}

function Card4() {
  return (
    <div className="basis-0 bg-white grow min-h-px min-w-px relative rounded-[16px] shrink-0 w-[997px]" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[rgba(57,81,146,0.1)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[40px] h-full items-start pl-[37px] pr-px py-[37px] relative w-[997px]">
        <CourseManagementPage4 />
        <CourseManagementPage5 />
      </div>
    </div>
  );
}

function PrimitiveDiv() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[437.188px] items-start relative shrink-0 w-full" data-name="Primitive.div">
      <TabList />
      <Card4 />
    </div>
  );
}

function Container11() {
  return (
    <div className="h-[733.188px] relative shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-[24px] h-[733.188px] items-start pb-0 pt-[32px] px-[64px] relative w-full">
          <Container4 />
          <Container9 />
          <PrimitiveDiv />
        </div>
      </div>
    </div>
  );
}

function CourseManagementPage6() {
  return (
    <div className="bg-gradient-to-b content-stretch flex flex-col from-[#fafbff] h-[1500px] items-start relative shrink-0 to-[#fafbff] via-50% via-[rgba(240,249,255,0.3)] w-full" data-name="CourseManagementPage">
      <Container11 />
    </div>
  );
}

function Icon8() {
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

function Container12() {
  return (
    <div className="bg-gradient-to-b from-[#395192] relative rounded-[16px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 size-[40px] to-[#06b6d4]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-[40px]">
        <Icon8 />
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[28px] relative shrink-0 w-[122.25px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[28px] relative w-[122.25px]">
        <p className="absolute bg-clip-text font-['Roboto:Bold',sans-serif] font-bold leading-[28px] left-0 text-[20px] text-nowrap text-slate-900 top-[-1px] whitespace-pre" style={{ WebkitTextFillColor: "transparent", fontVariationSettings: "'wdth' 100", backgroundImage: "linear-gradient(90deg, rgb(15, 23, 42) 0%, rgb(15, 23, 42) 100%), linear-gradient(167.176deg, rgb(57, 81, 146) 0%, rgb(6, 182, 212) 100%)" }}>
          CerebroLearn
        </p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex gap-[12px] h-[40px] items-center relative shrink-0 w-full" data-name="Container">
      <Container12 />
      <Text3 />
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="h-[78px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[26px] left-0 text-[16px] text-slate-500 top-0 w-[367px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Transforming online education with accessible, engaging, and interactive learning experiences. Join thousands of learners worldwide.
      </p>
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[24px] left-0 text-[16px] text-nowrap text-slate-900 top-0 whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Subscribe to our newsletter
      </p>
    </div>
  );
}

function Input() {
  return (
    <div className="basis-0 bg-[rgba(0,0,0,0)] grow h-[44px] min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex h-[44px] items-center px-[12px] py-[8px] relative w-full">
          <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[14px] text-nowrap text-slate-500 whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
            Enter your email
          </p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(57,81,146,0.05)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Icon9() {
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

function Button4() {
  return (
    <div className="bg-[#395192] relative rounded-[10px] shrink-0 size-[44px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-[44px]">
        <Icon9 />
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex gap-[12px] h-[44px] items-start relative shrink-0 w-full" data-name="Container">
      <Input />
      <Button4 />
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[84px] items-start relative shrink-0 w-full" data-name="Container">
      <Paragraph11 />
      <Container14 />
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[32px] h-[266px] items-start left-0 top-0 w-[373.188px]" data-name="Container">
      <Container13 />
      <Paragraph10 />
      <Container15 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Roboto:Bold',sans-serif] font-bold leading-[28px] left-0 text-[18px] text-nowrap text-slate-900 top-0 whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Explore
      </p>
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute h-[20px] left-0 top-[3px] w-[101.391px]" data-name="Button">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[51px] text-[14px] text-center text-nowrap text-slate-500 top-[-1px] translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Browse Courses
      </p>
    </div>
  );
}

function ListItem() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Button5 />
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute h-[20px] left-0 top-[3px] w-[76.375px]" data-name="Button">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[38.5px] text-[14px] text-center text-nowrap text-slate-500 top-[-1px] translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        My Learning
      </p>
    </div>
  );
}

function ListItem1() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Button6 />
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute h-[20px] left-0 top-[3px] w-[78.625px]" data-name="Button">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[39.5px] text-[14px] text-center text-nowrap text-slate-500 top-[-1px] translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Leaderboard
      </p>
    </div>
  );
}

function ListItem2() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Button7 />
    </div>
  );
}

function Button8() {
  return (
    <div className="absolute h-[20px] left-0 top-[3px] w-[88.266px]" data-name="Button">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[44.5px] text-[14px] text-center text-nowrap text-slate-500 top-[-1px] translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Achievements
      </p>
    </div>
  );
}

function ListItem3() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Button8 />
    </div>
  );
}

function Button9() {
  return (
    <div className="absolute h-[20px] left-0 top-[3px] w-[67.547px]" data-name="Button">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[34px] text-[14px] text-center text-nowrap text-slate-500 top-[-1px] translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Instructors
      </p>
    </div>
  );
}

function ListItem4() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Button9 />
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

function Container17() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[32px] h-[266px] items-start left-[437.19px] top-0 w-[154.609px]" data-name="Container">
      <Heading2 />
      <List />
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Roboto:Bold',sans-serif] font-bold leading-[28px] left-0 text-[18px] text-nowrap text-slate-900 top-0 whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Support
      </p>
    </div>
  );
}

function Button10() {
  return (
    <div className="absolute h-[20px] left-0 top-[3px] w-[73.172px]" data-name="Button">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[37px] text-[14px] text-center text-nowrap text-slate-500 top-[-1px] translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Help Center
      </p>
    </div>
  );
}

function ListItem5() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Button10 />
    </div>
  );
}

function Button11() {
  return (
    <div className="absolute h-[20px] left-0 top-[3px] w-[68.719px]" data-name="Button">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[34.5px] text-[14px] text-center text-nowrap text-slate-500 top-[-1px] translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Contact Us
      </p>
    </div>
  );
}

function ListItem6() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Button11 />
    </div>
  );
}

function Button12() {
  return (
    <div className="absolute h-[20px] left-0 top-[3px] w-[86.188px]" data-name="Button">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[43.5px] text-[14px] text-center text-nowrap text-slate-500 top-[-1px] translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Privacy Policy
      </p>
    </div>
  );
}

function ListItem7() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Button12 />
    </div>
  );
}

function Button13() {
  return (
    <div className="absolute h-[20px] left-0 top-[3px] w-[104.688px]" data-name="Button">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[52.5px] text-[14px] text-center text-nowrap text-slate-500 top-[-1px] translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Terms of Service
      </p>
    </div>
  );
}

function ListItem8() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Button13 />
    </div>
  );
}

function Button14() {
  return (
    <div className="absolute h-[20px] left-0 top-[3px] w-[78.359px]" data-name="Button">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[39.5px] text-[14px] text-center text-nowrap text-slate-500 top-[-1px] translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Accessibility
      </p>
    </div>
  );
}

function ListItem9() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Button14 />
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

function Container18() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[32px] h-[266px] items-start left-[655.8px] top-0 w-[154.594px]" data-name="Container">
      <Heading3 />
      <List1 />
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Roboto:Bold',sans-serif] font-bold leading-[28px] left-0 text-[18px] text-nowrap text-slate-900 top-0 whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Contact
      </p>
    </div>
  );
}

function Icon10() {
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

function Text4() {
  return (
    <div className="absolute h-[20px] left-[32px] top-0 w-[151.953px]" data-name="Text">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[14px] text-nowrap text-slate-500 top-[-1px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        hello@cerebrolearn.com
      </p>
    </div>
  );
}

function ListItem10() {
  return (
    <div className="h-[22px] relative shrink-0 w-full" data-name="List Item">
      <Icon10 />
      <Text4 />
    </div>
  );
}

function Icon11() {
  return (
    <div className="absolute left-0 size-[20px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_168_808)" id="Icon">
          <path d={svgPaths.p24c7c480} id="Vector" stroke="var(--stroke-0, #395192)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_168_808">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text5() {
  return (
    <div className="absolute h-[20px] left-[32px] top-0 w-[114.984px]" data-name="Text">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[14px] text-nowrap text-slate-500 top-[-1px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        +1 (555) 123-4567
      </p>
    </div>
  );
}

function ListItem11() {
  return (
    <div className="h-[22px] relative shrink-0 w-full" data-name="List Item">
      <Icon11 />
      <Text5 />
    </div>
  );
}

function Icon12() {
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

function Text6() {
  return (
    <div className="absolute h-[20px] left-[32px] top-0 w-[112.266px]" data-name="Text">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[14px] text-nowrap text-slate-500 top-[-1px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        San Francisco, CA
      </p>
    </div>
  );
}

function ListItem12() {
  return (
    <div className="h-[22px] relative shrink-0 w-full" data-name="List Item">
      <Icon12 />
      <Text6 />
    </div>
  );
}

function List2() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] h-[106px] items-start relative shrink-0 w-full" data-name="List">
      <ListItem10 />
      <ListItem11 />
      <ListItem12 />
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[32px] h-[266px] items-start left-[874.39px] top-0 w-[154.594px]" data-name="Container">
      <Heading4 />
      <List2 />
    </div>
  );
}

function Container20() {
  return (
    <div className="h-[266px] relative shrink-0 w-full" data-name="Container">
      <Container16 />
      <Container17 />
      <Container18 />
      <Container19 />
    </div>
  );
}

function Icon13() {
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

function Button15() {
  return (
    <div className="bg-slate-100 relative rounded-[3.35544e+07px] shrink-0 size-[44px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-[44px]">
        <Icon13 />
      </div>
    </div>
  );
}

function Icon14() {
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

function Button16() {
  return (
    <div className="bg-slate-100 relative rounded-[3.35544e+07px] shrink-0 size-[44px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-[44px]">
        <Icon14 />
      </div>
    </div>
  );
}

function Icon15() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_168_835)" id="Icon">
          <path d={svgPaths.p4b98700} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p29b16f80} id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M14.5833 5.41667H14.5917" id="Vector_3" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_168_835">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button17() {
  return (
    <div className="bg-slate-100 relative rounded-[3.35544e+07px] shrink-0 size-[44px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-[44px]">
        <Icon15 />
      </div>
    </div>
  );
}

function Icon16() {
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

function Button18() {
  return (
    <div className="bg-slate-100 relative rounded-[3.35544e+07px] shrink-0 size-[44px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-[44px]">
        <Icon16 />
      </div>
    </div>
  );
}

function Icon17() {
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

function Button19() {
  return (
    <div className="basis-0 bg-slate-100 grow h-[44px] min-h-px min-w-px relative rounded-[3.35544e+07px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex h-[44px] items-center justify-center relative w-full">
        <Icon17 />
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="h-[44px] relative shrink-0 w-[300px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[20px] h-[44px] items-center relative w-[300px]">
        <Button15 />
        <Button16 />
        <Button17 />
        <Button18 />
        <Button19 />
      </div>
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[20px] relative w-full">
        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[14px] text-nowrap text-slate-500 top-[-1px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          © 2025 CerebroLearn Inc. All rights reserved.
        </p>
      </div>
    </div>
  );
}

function Button20() {
  return (
    <div className="h-[20px] relative shrink-0 w-[45.234px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[20px] relative w-[45.234px]">
        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[23px] text-[14px] text-center text-nowrap text-slate-500 top-[-1px] translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          Privacy
        </p>
      </div>
    </div>
  );
}

function Text7() {
  return (
    <div className="h-[24px] relative shrink-0 w-[5.406px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[24px] relative w-[5.406px]">
        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[24px] left-0 text-[16px] text-nowrap text-slate-500 top-0 whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          •
        </p>
      </div>
    </div>
  );
}

function Button21() {
  return (
    <div className="h-[20px] relative shrink-0 w-[39.359px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[20px] relative w-[39.359px]">
        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[20px] text-[14px] text-center text-nowrap text-slate-500 top-[-1px] translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          Terms
        </p>
      </div>
    </div>
  );
}

function Button22() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[20px] relative w-full">
        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[25.5px] text-[14px] text-center text-nowrap text-slate-500 top-[-1px] translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          Cookies
        </p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="h-[24px] relative shrink-0 w-[225.641px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[20px] h-[24px] items-center relative w-[225.641px]">
        <Button20 />
        <Text7 />
        <Button21 />
        <Text7 />
        <Button22 />
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="h-[24px] relative shrink-0 w-[528.328px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[24px] h-[24px] items-center relative w-[528.328px]">
        <Paragraph12 />
        <Container22 />
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex h-[44px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container21 />
      <Container23 />
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex flex-col h-[85px] items-start pb-0 pt-[41px] px-0 relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(57,81,146,0.05)] border-solid inset-0 pointer-events-none" />
      <Container24 />
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex flex-col gap-[64px] h-[415px] items-start relative shrink-0 w-full" data-name="Container">
      <Container20 />
      <Container25 />
    </div>
  );
}

function Section() {
  return (
    <div className="h-[576px] relative shrink-0 w-full" data-name="Section">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(57,81,146,0.05)] border-solid inset-0 pointer-events-none" />
      <div className="size-full">
        <div className="content-stretch flex flex-col h-[576px] items-start pb-0 pt-[81px] px-[48px] relative w-full">
          <Container26 />
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="content-stretch flex flex-col h-[577px] items-start pb-0 pt-px px-0 relative shrink-0 w-full" data-name="Footer">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(57,81,146,0.05)] border-solid inset-0 pointer-events-none" />
      <Section />
    </div>
  );
}

function AppContent() {
  return (
    <div className="absolute bg-[#fafbff] content-stretch flex flex-col h-[2158px] items-start left-0 pb-0 pl-[300px] pr-0 pt-[81px] top-0 w-[1425px]" data-name="AppContent">
      <CourseManagementPage6 />
      <Footer />
    </div>
  );
}

function Text8() {
  return (
    <div className="absolute h-[24px] left-0 top-[-20000px] w-[9px]" data-name="Text">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[24px] left-0 text-[16px] text-nowrap text-slate-900 top-0 whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        0
      </p>
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Roboto:SemiBold',sans-serif] font-semibold leading-[28px] left-0 text-[18px] text-nowrap text-slate-900 top-0 whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Course Creator
      </p>
    </div>
  );
}

function Paragraph13() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[14px] text-nowrap text-slate-500 top-[-1px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Manage your content
      </p>
    </div>
  );
}

function Container27() {
  return (
    <div className="basis-0 grow h-[48px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col h-[48px] items-start relative w-full">
        <Heading1 />
        <Paragraph13 />
      </div>
    </div>
  );
}

function Icon18() {
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

function Button23() {
  return (
    <div className="relative rounded-[12px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-[32px]">
        <Icon18 />
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex h-[48px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container27 />
      <Button23 />
    </div>
  );
}

function Icon19() {
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

function Container29() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[20px] relative w-full">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-0 text-[14px] text-nowrap text-slate-500 top-[-1px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          Dashboard
        </p>
      </div>
    </div>
  );
}

function Button24() {
  return (
    <div className="h-[44px] relative rounded-[12px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] h-[44px] items-center px-[16px] py-0 relative w-full">
          <Icon19 />
          <Container29 />
        </div>
      </div>
    </div>
  );
}

function Icon20() {
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

function Container30() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[20px] relative w-full">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-0 text-[14px] text-nowrap text-white top-[-1px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          My Courses
        </p>
      </div>
    </div>
  );
}

function Icon21() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon" opacity="0.932281">
          <path d="M6 12L10 8L6 4" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button25() {
  return (
    <div className="bg-[#395192] h-[44px] relative rounded-[12px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[11px] h-[44px] items-center pl-[15px] pr-[16px] py-0 relative w-full">
          <Icon20 />
          <Container30 />
          <Icon21 />
        </div>
      </div>
    </div>
  );
}

function Icon22() {
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

function Container31() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[20px] relative w-full">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-0 text-[14px] text-nowrap text-slate-500 top-[-1px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          Analytics
        </p>
      </div>
    </div>
  );
}

function Button26() {
  return (
    <div className="h-[44px] relative rounded-[12px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] h-[44px] items-center px-[16px] py-0 relative w-full">
          <Icon22 />
          <Container31 />
        </div>
      </div>
    </div>
  );
}

function Icon23() {
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

function Container32() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[20px] relative w-full">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-0 text-[14px] text-nowrap text-slate-500 top-[-1px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          Subscribers
        </p>
      </div>
    </div>
  );
}

function Button27() {
  return (
    <div className="h-[44px] relative rounded-[12px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] h-[44px] items-center px-[16px] py-0 relative w-full">
          <Icon23 />
          <Container32 />
        </div>
      </div>
    </div>
  );
}

function Icon24() {
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

function Container33() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[20px] relative w-full">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-0 text-[14px] text-nowrap text-slate-500 top-[-1px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          Revenue
        </p>
      </div>
    </div>
  );
}

function Button28() {
  return (
    <div className="h-[44px] relative rounded-[12px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] h-[44px] items-center px-[16px] py-0 relative w-full">
          <Icon24 />
          <Container33 />
        </div>
      </div>
    </div>
  );
}

function Icon25() {
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

function Container34() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[20px] relative w-full">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-0 text-[14px] text-nowrap text-slate-500 top-[-1px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          Settings
        </p>
      </div>
    </div>
  );
}

function Button29() {
  return (
    <div className="h-[44px] relative rounded-[12px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] h-[44px] items-center px-[16px] py-0 relative w-full">
          <Icon25 />
          <Container34 />
        </div>
      </div>
    </div>
  );
}

function Navigation() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[284px] items-start relative shrink-0 w-full" data-name="Navigation">
      <Button24 />
      <Button25 />
      <Button26 />
      <Button27 />
      <Button28 />
      <Button29 />
    </div>
  );
}

function Container35() {
  return (
    <div className="h-[404px] relative shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-[24px] h-[404px] items-start pb-0 pt-[24px] px-[24px] relative w-full">
          <Container28 />
          <Navigation />
        </div>
      </div>
    </div>
  );
}

function CourseCreatorSidebar() {
  return (
    <div className="absolute bg-white h-[1420px] left-0 top-[80px] w-[300px]" data-name="CourseCreatorSidebar">
      <div className="content-stretch flex flex-col h-[1420px] items-start overflow-clip pl-0 pr-px py-0 relative rounded-[inherit] w-[300px]">
        <Container35 />
      </div>
      <div aria-hidden="true" className="absolute border-[0px_1px_0px_0px] border-[rgba(57,81,146,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon26() {
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

function Container36() {
  return (
    <div className="bg-gradient-to-b from-[#395192] relative rounded-[16px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 size-[36px] to-[#06b6d4]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-[36px]">
        <Icon26 />
      </div>
    </div>
  );
}

function Text9() {
  return (
    <div className="basis-0 grow h-[28px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[28px] relative w-full">
        <p className="absolute bg-clip-text font-['Roboto:Bold',sans-serif] font-bold leading-[28px] left-[55.5px] text-[18px] text-[rgba(0,0,0,0)] text-center text-nowrap top-0 translate-x-[-50%] whitespace-pre" style={{ WebkitTextFillColor: "transparent", fontVariationSettings: "'wdth' 100", backgroundImage: "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(rgb(57, 81, 146) 0%, rgb(6, 182, 212) 100%)" }}>
          CerebroLearn
        </p>
      </div>
    </div>
  );
}

function Button30() {
  return (
    <div className="h-[36px] relative shrink-0 w-[158.031px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] h-[36px] items-center relative w-[158.031px]">
        <Container36 />
        <Text9 />
      </div>
    </div>
  );
}

function Button31() {
  return (
    <div className="h-[40px] relative rounded-[12px] shrink-0 w-[107.75px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[40px] relative w-[107.75px]">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-[54px] text-[14px] text-center text-nowrap text-slate-500 top-[9px] translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          Dashboard
        </p>
      </div>
    </div>
  );
}

function Button32() {
  return (
    <div className="h-[40px] relative rounded-[12px] shrink-0 w-[91.734px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[40px] relative w-[91.734px]">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-[46px] text-[14px] text-center text-nowrap text-slate-500 top-[9px] translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          Courses
        </p>
      </div>
    </div>
  );
}

function Button33() {
  return (
    <div className="basis-0 grow h-[40px] min-h-px min-w-px relative rounded-[12px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[40px] relative w-full">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-[60px] text-[14px] text-center text-nowrap text-slate-500 top-[9px] translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          Leaderboard
        </p>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="basis-0 grow h-[40px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] h-[40px] items-center relative w-full">
        <Button31 />
        <Button32 />
        <Button33 />
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="h-[40px] relative shrink-0 w-[540.531px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[48px] h-[40px] items-center relative w-[540.531px]">
        <Button30 />
        <Container37 />
      </div>
    </div>
  );
}

function Icon27() {
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

function Button34() {
  return (
    <div className="relative rounded-[3.35544e+07px] shrink-0 size-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-[36px]">
        <Icon27 />
      </div>
    </div>
  );
}

function Icon28() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_168_823)" id="Icon">
          <path d={svgPaths.p23166800} id="Vector" stroke="var(--stroke-0, #F0B100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1a3c1838} id="Vector_2" stroke="var(--stroke-0, #F0B100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1b84be20} id="Vector_3" stroke="var(--stroke-0, #F0B100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2.66667 14.6667H13.3333" id="Vector_4" stroke="var(--stroke-0, #F0B100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1c3dcc70} id="Vector_5" stroke="var(--stroke-0, #F0B100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p30052a00} id="Vector_6" stroke="var(--stroke-0, #F0B100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_168_823">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text10() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[20px] relative w-full">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-0 text-[14px] text-slate-900 top-[-1px] w-[54px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          1250 XP
        </p>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="absolute bg-gradient-to-r content-stretch flex from-[rgba(173,70,255,0.1)] gap-[8px] h-[34px] items-center left-0 px-[13px] py-px rounded-[3.35544e+07px] to-[rgba(246,51,154,0.1)] top-[3px] w-[103.094px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(57,81,146,0.1)] border-solid inset-0 pointer-events-none rounded-[3.35544e+07px]" />
      <Icon28 />
      <Text10 />
    </div>
  );
}

function Text11() {
  return (
    <div className="basis-0 bg-slate-100 grow h-[40px] min-h-px min-w-px relative rounded-[3.35544e+07px] shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex h-[40px] items-center justify-center relative w-full">
        <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[14px] text-center text-nowrap text-slate-900 whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          D
        </p>
      </div>
    </div>
  );
}

function PrimitiveSpan() {
  return (
    <div className="absolute content-stretch flex items-start left-0 overflow-clip rounded-[3.35544e+07px] size-[40px] top-0" data-name="Primitive.span">
      <Text11 />
    </div>
  );
}

function Button35() {
  return (
    <div className="absolute left-[115.09px] rounded-[3.35544e+07px] size-[40px] top-0" data-name="Button">
      <PrimitiveSpan />
    </div>
  );
}

function Container40() {
  return (
    <div className="basis-0 grow h-[40px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[40px] relative w-full">
        <Container39 />
        <Button35 />
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="h-[40px] relative shrink-0 w-[211.094px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[20px] h-[40px] items-center relative w-[211.094px]">
        <Button34 />
        <Container40 />
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="h-[80px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex h-[80px] items-center justify-between px-[48px] py-0 relative w-full">
          <Container38 />
          <Container41 />
        </div>
      </div>
    </div>
  );
}

function Navbar() {
  return (
    <div className="absolute bg-[rgba(250,251,255,0.6)] content-stretch flex flex-col h-[81px] items-start left-0 pb-px pt-0 px-0 top-0 w-[1425px]" data-name="Navbar">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(57,81,146,0.05)] border-solid inset-0 pointer-events-none shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
      <Container42 />
    </div>
  );
}

export default function CerebroLearn() {
  return (
    <div className="bg-[#fafbff] relative size-full" data-name="CerebroLearn">
      <AppContent />
      <Text8 />
      <CourseCreatorSidebar />
      <Navbar />
    </div>
  );
}