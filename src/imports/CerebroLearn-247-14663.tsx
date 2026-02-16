import svgPaths from "./svg-wc95fxdimi";

function Heading() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute font-['Roboto:Bold',sans-serif] font-bold leading-[36px] left-0 text-[#101828] text-[30px] text-nowrap top-[-1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Create New Course
      </p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[24px] left-0 text-[#4a5565] text-[16px] text-nowrap top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Follow the steps below to create your course
      </p>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[68px] relative shrink-0 w-[316.844px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Heading />
        <Paragraph />
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="basis-0 grow h-[42px] min-h-px min-w-px relative rounded-[12px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[24px] left-[64.5px] text-[#0f172a] text-[16px] text-center text-nowrap top-[9px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Save as Draft
        </p>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-1/4" data-name="Vector">
        <div className="absolute inset-[-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
            <path d="M13 1L1 13" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-1/4" data-name="Vector">
        <div className="absolute inset-[-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
            <path d="M1 1L13 13" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="relative rounded-[12px] shrink-0 size-[48px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-0 pt-[12px] px-[12px] relative size-full">
        <Icon />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[48px] relative shrink-0 w-[188.234px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Button />
        <Button1 />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute content-stretch flex h-[68px] items-start justify-between left-0 top-0 w-[1024px]" data-name="Container">
      <Container />
      <Container1 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p1f023100} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M9 11L12 14L22 4" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container3() {
  return (
    <div className="basis-0 bg-[#00c950] grow min-h-px min-w-px relative rounded-[3.35544e+07px] shrink-0 w-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon1 />
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[20px] relative shrink-0 w-[62.594px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-[31.5px] text-[#364153] text-[14px] text-center text-nowrap top-[-1px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Basic Info
        </p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="basis-0 grow h-[76px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-center relative size-full">
        <Container3 />
        <Text />
      </div>
    </div>
  );
}

function Container5() {
  return <div className="basis-0 bg-[#00c950] grow h-[4px] min-h-px min-w-px rounded-[4px] shrink-0" data-name="Container" />;
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p1f023100} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M9 11L12 14L22 4" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container6() {
  return (
    <div className="basis-0 bg-[#00c950] grow min-h-px min-w-px relative rounded-[3.35544e+07px] shrink-0 w-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon2 />
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[40px] relative shrink-0 w-[94px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-[47.25px] text-[#364153] text-[14px] text-center top-[-1px] translate-x-[-50%] w-[50px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Content Details
        </p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="basis-0 grow h-[96px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-center relative size-full">
        <Container6 />
        <Text1 />
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p1f023100} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M9 11L12 14L22 4" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container8() {
  return (
    <div className="basis-0 bg-[#00c950] grow min-h-px min-w-px relative rounded-[3.35544e+07px] shrink-0 w-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon3 />
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[69.047px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-[35px] text-[#364153] text-[14px] text-center text-nowrap top-[-1px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Curriculum
        </p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="basis-0 grow h-[76px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-center relative size-full">
        <Container8 />
        <Text2 />
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p1f023100} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M9 11L12 14L22 4" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container10() {
  return (
    <div className="basis-0 bg-[#00c950] grow min-h-px min-w-px relative rounded-[3.35544e+07px] shrink-0 w-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon4 />
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[44.063px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-[22.5px] text-[#364153] text-[14px] text-center text-nowrap top-[-1px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Pricing
        </p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="basis-0 grow h-[76px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-center relative size-full">
        <Container10 />
        <Text3 />
      </div>
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p1f023100} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M9 11L12 14L22 4" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container12() {
  return (
    <div className="basis-0 bg-[#395192] grow min-h-px min-w-px relative rounded-[3.35544e+07px] shrink-0 w-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon5 />
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[20px] relative shrink-0 w-[46.719px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-[23.5px] text-[#364153] text-[14px] text-center text-nowrap top-[-1px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Publish
        </p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="basis-0 grow h-[76px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-center relative size-full">
        <Container12 />
        <Text4 />
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex h-[96px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container4 />
      <Container5 />
      <Container7 />
      <Container5 />
      <Container9 />
      <Container5 />
      <Container11 />
      <Container5 />
      <Container13 />
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[146px] items-start left-0 pb-px pt-[25px] px-[25px] rounded-[12px] top-[100px] w-[1024px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Container14 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Roboto:Bold',sans-serif] font-bold leading-[32px] left-0 text-[#101828] text-[24px] text-nowrap top-[-1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Publish Settings
      </p>
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p25397b80} id="Vector" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p18406864} id="Vector_2" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2241fff0} id="Vector_3" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2c4f400} id="Vector_4" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function CardTitle() {
  return (
    <div className="basis-0 grow h-[16px] min-h-px min-w-px relative shrink-0" data-name="CardTitle">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#0f172a] text-[16px] text-nowrap top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
          Collaboration
        </p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="h-[20px] relative shrink-0 w-[123.031px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Icon6 />
        <CardTitle />
      </div>
    </div>
  );
}

function Badge() {
  return (
    <div className="bg-[#06b6d4] h-[22px] relative rounded-[10px] shrink-0 w-[72.563px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit] size-full">
        <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[12px] text-nowrap text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
          1 member
        </p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function CollaborationPanel() {
  return (
    <div className="[grid-area:1_/_1] content-stretch flex items-center justify-between place-self-stretch relative shrink-0" data-name="CollaborationPanel">
      <Container16 />
      <Badge />
    </div>
  );
}

function CardDescription() {
  return (
    <div className="[grid-area:2_/_1] place-self-stretch relative shrink-0" data-name="CardDescription">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[24px] left-0 text-[#64748b] text-[16px] text-nowrap top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Work together with your team
      </p>
    </div>
  );
}

function CardHeader() {
  return (
    <div className="absolute gap-[8px] grid grid-cols-[repeat(1,_minmax(0px,_1fr))] grid-rows-[minmax(0px,_22fr)_minmax(0px,_1fr)] h-[86px] left-[6px] pb-0 pt-[32px] px-[32px] top-[6px] w-[962px]" data-name="CardHeader">
      <CollaborationPanel />
      <CardDescription />
    </div>
  );
}

function PrimitiveButton() {
  return (
    <div className="absolute content-stretch flex h-[29px] items-center justify-center left-[3px] px-[9px] py-[5px] rounded-[16px] top-[3.5px] w-[297.328px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[#64748b] text-[14px] text-center text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Team
      </p>
    </div>
  );
}

function Badge1() {
  return (
    <div className="absolute bg-[rgba(239,68,68,0.6)] left-[178.98px] rounded-[10px] size-[20px] top-[3.5px]" data-name="Badge">
      <div className="content-stretch flex items-center justify-center overflow-clip p-px relative rounded-[inherit] size-full">
        <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[12px] text-center text-nowrap text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
          2
        </p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function PrimitiveButton1() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border border-[rgba(0,0,0,0)] border-solid h-[29px] left-[300.33px] rounded-[16px] top-[3.5px] w-[297.328px]" data-name="Primitive.button">
      <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-[130.84px] text-[#0f172a] text-[14px] text-center text-nowrap top-[2.5px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Comments
      </p>
      <Badge1 />
    </div>
  );
}

function PrimitiveButton2() {
  return (
    <div className="absolute content-stretch flex h-[29px] items-center justify-center left-[597.66px] px-[9px] py-[5px] rounded-[16px] top-[3.5px] w-[297.344px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[#64748b] text-[14px] text-center text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        History
      </p>
    </div>
  );
}

function TabList() {
  return (
    <div className="bg-[#f1f5f9] h-[36px] relative rounded-[16px] shrink-0 w-[898px]" data-name="Tab List">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <PrimitiveButton />
        <PrimitiveButton1 />
        <PrimitiveButton2 />
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[40px] relative rounded-[8px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[12px] py-[8px] relative size-full">
          <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[14px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            General
          </p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Textarea() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[80px] relative rounded-[8px] shrink-0 w-full" data-name="Textarea">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start px-[12px] py-[8px] relative size-full">
          <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#64748b] text-[14px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            Add a comment or suggestion...
          </p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Icon7() {
  return (
    <div className="absolute left-[388.02px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p1bb15080} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#395192] h-[36px] relative rounded-[10px] shrink-0 w-full" data-name="Button">
      <Icon7 />
      <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-[465.02px] text-[14px] text-center text-nowrap text-white top-[7px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Add Comment
      </p>
    </div>
  );
}

function CollaborationPanel1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[172px] items-start relative shrink-0 w-full" data-name="CollaborationPanel">
      <Input />
      <Textarea />
      <Button2 />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-0 text-[#0f172a] text-[14px] text-nowrap top-[-1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        You
      </p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#64748b] text-[12px] text-nowrap top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        12/30/2025, 5:39:56 AM
      </p>
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute content-stretch flex flex-col h-[36px] items-start left-[32px] top-0 w-[130.016px]" data-name="Container">
      <Paragraph1 />
      <Paragraph2 />
    </div>
  );
}

function Text5() {
  return (
    <div className="basis-0 bg-[#f1f5f9] grow h-[24px] min-h-px min-w-px relative rounded-[3.35544e+07px] shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#0f172a] text-[12px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
          YO
        </p>
      </div>
    </div>
  );
}

function PrimitiveSpan() {
  return (
    <div className="absolute content-stretch flex items-start left-0 overflow-clip rounded-[3.35544e+07px] size-[24px] top-[6px]" data-name="Primitive.span">
      <Text5 />
    </div>
  );
}

function Container18() {
  return (
    <div className="h-[36px] relative shrink-0 w-[162.016px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container17 />
        <PrimitiveSpan />
      </div>
    </div>
  );
}

function Badge2() {
  return (
    <div className="bg-[#395192] h-[22px] relative rounded-[10px] shrink-0 w-[59.281px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit] size-full">
        <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[12px] text-nowrap text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
          General
        </p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute content-stretch flex h-[36px] items-start justify-between left-[13px] top-[13px] w-[872px]" data-name="Container">
      <Container18 />
      <Badge2 />
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="absolute h-[20px] left-[13px] top-[57px] w-[872px]" data-name="Paragraph">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#0f172a] text-[14px] text-nowrap top-[-1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        This is a Comment
      </p>
    </div>
  );
}

function Icon8() {
  return (
    <div className="absolute left-[10px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p39be50} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute bg-[#395192] h-[32px] left-[13px] rounded-[10px] top-[85px] w-[95.391px]" data-name="Button">
      <Icon8 />
      <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-[61px] text-[14px] text-center text-nowrap text-white top-[5px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Resolve
      </p>
    </div>
  );
}

function Container20() {
  return (
    <div className="h-[130px] relative rounded-[12px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(57,81,146,0.1)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Container19 />
      <Paragraph3 />
      <Button3 />
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-0 text-[#0f172a] text-[14px] text-nowrap top-[-1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        You
      </p>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#64748b] text-[12px] text-nowrap top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        12/30/2025, 5:40:13 AM
      </p>
    </div>
  );
}

function Container21() {
  return (
    <div className="absolute content-stretch flex flex-col h-[36px] items-start left-[32px] top-0 w-[130.016px]" data-name="Container">
      <Paragraph4 />
      <Paragraph5 />
    </div>
  );
}

function Text6() {
  return (
    <div className="basis-0 bg-[#f1f5f9] grow h-[24px] min-h-px min-w-px relative rounded-[3.35544e+07px] shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#0f172a] text-[12px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
          YO
        </p>
      </div>
    </div>
  );
}

function PrimitiveSpan1() {
  return (
    <div className="absolute content-stretch flex items-start left-0 overflow-clip rounded-[3.35544e+07px] size-[24px] top-[6px]" data-name="Primitive.span">
      <Text6 />
    </div>
  );
}

function Container22() {
  return (
    <div className="h-[36px] relative shrink-0 w-[162.016px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container21 />
        <PrimitiveSpan1 />
      </div>
    </div>
  );
}

function Badge3() {
  return (
    <div className="bg-[#395192] h-[22px] relative rounded-[10px] shrink-0 w-[59.281px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit] size-full">
        <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[12px] text-nowrap text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
          General
        </p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Container23() {
  return (
    <div className="absolute content-stretch flex h-[36px] items-start justify-between left-[13px] top-[13px] w-[872px]" data-name="Container">
      <Container22 />
      <Badge3 />
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="absolute h-[20px] left-[13px] top-[57px] w-[872px]" data-name="Paragraph">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#0f172a] text-[14px] text-nowrap top-[-1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        This is another comment
      </p>
    </div>
  );
}

function Icon9() {
  return (
    <div className="absolute left-[10px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p39be50} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute bg-[#395192] h-[32px] left-[13px] rounded-[10px] top-[85px] w-[95.391px]" data-name="Button">
      <Icon9 />
      <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-[61px] text-[14px] text-center text-nowrap text-white top-[5px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Resolve
      </p>
    </div>
  );
}

function Container24() {
  return (
    <div className="h-[130px] relative rounded-[12px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(57,81,146,0.1)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Container23 />
      <Paragraph6 />
      <Button4 />
    </div>
  );
}

function CollaborationPanel2() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[272px] items-start relative shrink-0 w-full" data-name="CollaborationPanel">
      <Container20 />
      <Container24 />
    </div>
  );
}

function TabPanel() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[898px]" data-name="Tab Panel">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start relative size-full">
        <CollaborationPanel1 />
        <CollaborationPanel2 />
      </div>
    </div>
  );
}

function PrimitiveDiv() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[504px] items-start left-[38px] top-[124px] w-[898px]" data-name="Primitive.div">
      <TabList />
      <TabPanel />
    </div>
  );
}

function Card() {
  return (
    <div className="bg-white h-[666px] relative rounded-[16px] shrink-0 w-full" data-name="Card">
      <div aria-hidden="true" className="absolute border-2 border-[rgba(57,81,146,0.1)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
      <CardHeader />
      <PrimitiveDiv />
    </div>
  );
}

function Icon10() {
  return (
    <div className="absolute left-[403.27px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p26b72c80} id="Vector" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[36px] relative rounded-[10px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Icon10 />
      <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-[503.27px] text-[#0f172a] text-[14px] text-center text-nowrap top-[7px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Collaborative Preview
      </p>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[24px] left-0 text-[#101828] text-[16px] text-nowrap top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Enable Reviews
      </p>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#4a5565] text-[14px] text-nowrap top-[-1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Allow students to leave reviews
      </p>
    </div>
  );
}

function Container25() {
  return (
    <div className="h-[44px] relative shrink-0 w-[194.906px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph7 />
        <Paragraph8 />
      </div>
    </div>
  );
}

function Checkbox() {
  return <div className="shrink-0 size-[20px]" data-name="Checkbox" />;
}

function Label() {
  return (
    <div className="h-[78px] relative rounded-[8px] shrink-0 w-full" data-name="Label">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[17px] py-px relative size-full">
          <Container25 />
          <Checkbox />
        </div>
      </div>
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[24px] left-0 text-[#101828] text-[16px] text-nowrap top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Enable Certificate
      </p>
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#4a5565] text-[14px] text-nowrap top-[-1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Award certificates upon completion
      </p>
    </div>
  );
}

function Container26() {
  return (
    <div className="h-[44px] relative shrink-0 w-[221px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph9 />
        <Paragraph10 />
      </div>
    </div>
  );
}

function Checkbox1() {
  return <div className="shrink-0 size-[20px]" data-name="Checkbox" />;
}

function Label1() {
  return (
    <div className="h-[78px] relative rounded-[8px] shrink-0 w-full" data-name="Label">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[17px] py-px relative size-full">
          <Container26 />
          <Checkbox1 />
        </div>
      </div>
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[24px] left-0 text-[#101828] text-[16px] text-nowrap top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Enable Discussions
      </p>
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#4a5565] text-[14px] text-nowrap top-[-1px]" style={{ fontVariationSettings: "'wdth' 100" }}>{`Allow course discussions and Q&A`}</p>
    </div>
  );
}

function Container27() {
  return (
    <div className="h-[44px] relative shrink-0 w-[215.859px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph11 />
        <Paragraph12 />
      </div>
    </div>
  );
}

function Checkbox2() {
  return <div className="shrink-0 size-[20px]" data-name="Checkbox" />;
}

function Label2() {
  return (
    <div className="h-[78px] relative rounded-[8px] shrink-0 w-full" data-name="Label">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[17px] py-px relative size-full">
          <Container27 />
          <Checkbox2 />
        </div>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[266px] items-start relative shrink-0 w-full" data-name="Container">
      <Label />
      <Label1 />
      <Label2 />
    </div>
  );
}

function PrimitiveLabel() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Primitive.label">
      <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-0 text-[#364153] text-[14px] text-nowrap top-[-1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Maximum Students (Optional)
      </p>
    </div>
  );
}

function Input1() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[40px] relative rounded-[8px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[16px] py-[12px] relative size-full">
          <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[14px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            Leave empty for unlimited
          </p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[68px] items-start relative shrink-0 w-full" data-name="Container">
      <PrimitiveLabel />
      <Input1 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Roboto:SemiBold',sans-serif] font-semibold leading-[24px] left-0 text-[#1c398e] text-[16px] text-nowrap top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Course Summary
      </p>
    </div>
  );
}

function Paragraph13() {
  return (
    <div className="h-[27.188px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[27.2px] left-0 text-[#155dfc] text-[16px] text-nowrap top-0 tracking-[0.16px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Title
      </p>
    </div>
  );
}

function Paragraph14() {
  return (
    <div className="h-[27.188px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[27.2px] left-0 text-[#1c398e] text-[16px] text-nowrap top-0 tracking-[0.16px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Complete Science Masterclass 2024
      </p>
    </div>
  );
}

function Container30() {
  return (
    <div className="[grid-area:1_/_1] content-stretch flex flex-col gap-[4px] items-start place-self-stretch relative shrink-0" data-name="Container">
      <Paragraph13 />
      <Paragraph14 />
    </div>
  );
}

function Paragraph15() {
  return (
    <div className="h-[27.188px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[27.2px] left-0 text-[#155dfc] text-[16px] text-nowrap top-0 tracking-[0.16px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Category
      </p>
    </div>
  );
}

function Paragraph16() {
  return (
    <div className="h-[27.188px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[27.2px] left-0 text-[#1c398e] text-[16px] text-nowrap top-0 tracking-[0.16px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Science
      </p>
    </div>
  );
}

function Container31() {
  return (
    <div className="[grid-area:1_/_2] content-stretch flex flex-col gap-[4px] items-start place-self-stretch relative shrink-0" data-name="Container">
      <Paragraph15 />
      <Paragraph16 />
    </div>
  );
}

function Paragraph17() {
  return (
    <div className="h-[27.188px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[27.2px] left-0 text-[#155dfc] text-[16px] text-nowrap top-0 tracking-[0.16px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Level
      </p>
    </div>
  );
}

function Paragraph18() {
  return (
    <div className="h-[27.188px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[27.2px] left-0 text-[#1c398e] text-[16px] text-nowrap top-0 tracking-[0.16px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Beginner
      </p>
    </div>
  );
}

function Container32() {
  return (
    <div className="[grid-area:2_/_1] content-stretch flex flex-col gap-[4px] items-start place-self-stretch relative shrink-0" data-name="Container">
      <Paragraph17 />
      <Paragraph18 />
    </div>
  );
}

function Paragraph19() {
  return (
    <div className="h-[27.188px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[27.2px] left-0 text-[#155dfc] text-[16px] text-nowrap top-0 tracking-[0.16px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Sections
      </p>
    </div>
  );
}

function Paragraph20() {
  return (
    <div className="h-[27.188px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[27.2px] left-0 text-[#1c398e] text-[16px] text-nowrap top-0 tracking-[0.16px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        5
      </p>
    </div>
  );
}

function Container33() {
  return (
    <div className="[grid-area:2_/_2] content-stretch flex flex-col gap-[4px] items-start place-self-stretch relative shrink-0" data-name="Container">
      <Paragraph19 />
      <Paragraph20 />
    </div>
  );
}

function Paragraph21() {
  return (
    <div className="h-[27.188px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[27.2px] left-0 text-[#155dfc] text-[16px] text-nowrap top-0 tracking-[0.16px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Total Lessons
      </p>
    </div>
  );
}

function Paragraph22() {
  return (
    <div className="h-[27.188px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[27.2px] left-0 text-[#1c398e] text-[16px] text-nowrap top-0 tracking-[0.16px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        25
      </p>
    </div>
  );
}

function Container34() {
  return (
    <div className="[grid-area:3_/_1] content-stretch flex flex-col gap-[4px] items-start place-self-stretch relative shrink-0" data-name="Container">
      <Paragraph21 />
      <Paragraph22 />
    </div>
  );
}

function Paragraph23() {
  return (
    <div className="h-[27.188px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[27.2px] left-0 text-[#155dfc] text-[16px] text-nowrap top-0 tracking-[0.16px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Price
      </p>
    </div>
  );
}

function Paragraph24() {
  return (
    <div className="h-[27.188px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[27.2px] left-0 text-[#1c398e] text-[16px] text-nowrap top-0 tracking-[0.16px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        USD 29.99
      </p>
    </div>
  );
}

function Container35() {
  return (
    <div className="[grid-area:3_/_2] content-stretch flex flex-col gap-[4px] items-start place-self-stretch relative shrink-0" data-name="Container">
      <Paragraph23 />
      <Paragraph24 />
    </div>
  );
}

function Container36() {
  return (
    <div className="gap-[16px] grid grid-cols-[repeat(2,_minmax(0px,_1fr))] grid-rows-[repeat(3,_minmax(0px,_1fr))] h-[207.125px] relative shrink-0 w-full" data-name="Container">
      <Container30 />
      <Container31 />
      <Container32 />
      <Container33 />
      <Container34 />
      <Container35 />
    </div>
  );
}

function Container37() {
  return (
    <div className="bg-[#eff6ff] h-[297.125px] relative rounded-[8px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#bedbff] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-[16px] items-start pb-px pt-[25px] px-[25px] relative size-full">
          <Heading2 />
          <Container36 />
        </div>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] h-[1485.125px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading1 />
      <Card />
      <Button5 />
      <Container28 />
      <Container29 />
      <Container37 />
    </div>
  );
}

function Container39() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[1535.125px] items-start left-0 pb-px pt-[25px] px-[25px] rounded-[8px] top-[270px] w-[1024px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Container38 />
    </div>
  );
}

function Icon11() {
  return (
    <div className="absolute left-[25px] size-[20px] top-[15px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M15 5L5 15" id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M5 5L15 15" id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="h-[50px] relative rounded-[12px] shrink-0 w-[171.172px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon11 />
        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[24px] left-[100px] text-[#364153] text-[16px] text-center text-nowrap top-[13px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Close Wizard
        </p>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="h-[20px] relative shrink-0 w-[67.203px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#4a5565] text-[14px] top-[-1px] w-[68px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Step 5 of 5
        </p>
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div className="h-[50px] relative rounded-[12px] shrink-0 w-[111.594px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[24px] left-[56px] text-[#0f172a] text-[16px] text-center text-nowrap top-[13px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Previous
        </p>
      </div>
    </div>
  );
}

function Icon12() {
  return (
    <div className="absolute left-[24px] size-[20px] top-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_247_14671)" id="Icon">
          <path d={svgPaths.p35700380} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3fe63d80} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_247_14671">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button8() {
  return (
    <div className="basis-0 bg-[#00a63e] grow h-[48px] min-h-px min-w-px relative rounded-[12px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon12 />
        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[24px] left-[106px] text-[16px] text-center text-nowrap text-white top-[12px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Publish Course
        </p>
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="h-[50px] relative shrink-0 w-[306.844px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Button7 />
        <Button8 />
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="absolute content-stretch flex h-[50px] items-center justify-between left-0 top-[1829.13px] w-[1024px]" data-name="Container">
      <Button6 />
      <Container40 />
      <Container41 />
    </div>
  );
}

function CourseCreationWizard() {
  return (
    <div className="h-[1879.125px] relative shrink-0 w-full" data-name="CourseCreationWizard2">
      <Container2 />
      <Container15 />
      <Container39 />
      <Container42 />
    </div>
  );
}

function CourseCreationChoice() {
  return (
    <div className="bg-gradient-to-b from-[#fafbff] h-[1943.125px] relative shrink-0 to-[#fafbff] via-50% via-[rgba(240,249,255,0.3)] w-full" data-name="CourseCreationChoice">
      <div className="size-full">
        <div className="content-stretch flex flex-col items-start pb-0 pt-[32px] px-[50.5px] relative size-full">
          <CourseCreationWizard />
        </div>
      </div>
    </div>
  );
}

function Icon13() {
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

function Container43() {
  return (
    <div className="bg-gradient-to-b from-[#395192] relative rounded-[16px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 size-[40px] to-[#06b6d4]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon13 />
      </div>
    </div>
  );
}

function Text7() {
  return (
    <div className="h-[28px] relative shrink-0 w-[122.25px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute bg-clip-text font-['Roboto:Bold',sans-serif] font-bold leading-[28px] left-0 text-[#0f172a] text-[20px] text-nowrap top-[-1px]" style={{ WebkitTextFillColor: "transparent", fontVariationSettings: "'wdth' 100", backgroundImage: "linear-gradient(90deg, rgb(15, 23, 42) 0%, rgb(15, 23, 42) 100%), linear-gradient(167.176deg, rgb(57, 81, 146) 0%, rgb(6, 182, 212) 100%)" }}>
          CerebroLearn
        </p>
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="content-stretch flex gap-[12px] h-[40px] items-center relative shrink-0 w-full" data-name="Container">
      <Container43 />
      <Text7 />
    </div>
  );
}

function Paragraph25() {
  return (
    <div className="h-[78px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[26px] left-0 text-[#64748b] text-[16px] top-0 w-[367px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Transforming online education with accessible, engaging, and interactive learning experiences. Join thousands of learners worldwide.
      </p>
    </div>
  );
}

function Paragraph26() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[24px] left-0 text-[#0f172a] text-[16px] text-nowrap top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Subscribe to our newsletter
      </p>
    </div>
  );
}

function Input2() {
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

function Icon14() {
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

function Button9() {
  return (
    <div className="bg-[#395192] relative rounded-[10px] shrink-0 size-[44px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon14 />
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="content-stretch flex gap-[12px] h-[44px] items-start relative shrink-0 w-full" data-name="Container">
      <Input2 />
      <Button9 />
    </div>
  );
}

function Container46() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[84px] items-start relative shrink-0 w-full" data-name="Container">
      <Paragraph26 />
      <Container45 />
    </div>
  );
}

function Container47() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[32px] h-[266px] items-start left-0 top-0 w-[373.188px]" data-name="Container">
      <Container44 />
      <Paragraph25 />
      <Container46 />
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Roboto:Bold',sans-serif] font-bold leading-[28px] left-0 text-[#0f172a] text-[18px] text-nowrap top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Explore
      </p>
    </div>
  );
}

function Button10() {
  return (
    <div className="absolute h-[20px] left-0 top-[3px] w-[101.391px]" data-name="Button">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[51px] text-[#64748b] text-[14px] text-center text-nowrap top-[-1px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Browse Courses
      </p>
    </div>
  );
}

function ListItem() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Button10 />
    </div>
  );
}

function Button11() {
  return (
    <div className="absolute h-[20px] left-0 top-[3px] w-[76.375px]" data-name="Button">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[38.5px] text-[#64748b] text-[14px] text-center text-nowrap top-[-1px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        My Learning
      </p>
    </div>
  );
}

function ListItem1() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Button11 />
    </div>
  );
}

function Button12() {
  return (
    <div className="absolute h-[20px] left-0 top-[3px] w-[78.625px]" data-name="Button">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[39.5px] text-[#64748b] text-[14px] text-center text-nowrap top-[-1px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Leaderboard
      </p>
    </div>
  );
}

function ListItem2() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Button12 />
    </div>
  );
}

function Button13() {
  return (
    <div className="absolute h-[20px] left-0 top-[3px] w-[88.266px]" data-name="Button">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[44.5px] text-[#64748b] text-[14px] text-center text-nowrap top-[-1px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Achievements
      </p>
    </div>
  );
}

function ListItem3() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Button13 />
    </div>
  );
}

function Button14() {
  return (
    <div className="absolute h-[20px] left-0 top-[3px] w-[67.547px]" data-name="Button">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[34px] text-[#64748b] text-[14px] text-center text-nowrap top-[-1px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Instructors
      </p>
    </div>
  );
}

function ListItem4() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Button14 />
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

function Container48() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[32px] h-[266px] items-start left-[437.19px] top-0 w-[154.609px]" data-name="Container">
      <Heading3 />
      <List />
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Roboto:Bold',sans-serif] font-bold leading-[28px] left-0 text-[#0f172a] text-[18px] text-nowrap top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Support
      </p>
    </div>
  );
}

function Button15() {
  return (
    <div className="absolute h-[20px] left-0 top-[3px] w-[73.172px]" data-name="Button">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[37px] text-[#64748b] text-[14px] text-center text-nowrap top-[-1px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Help Center
      </p>
    </div>
  );
}

function ListItem5() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Button15 />
    </div>
  );
}

function Button16() {
  return (
    <div className="absolute h-[20px] left-0 top-[3px] w-[68.719px]" data-name="Button">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[34.5px] text-[#64748b] text-[14px] text-center text-nowrap top-[-1px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Contact Us
      </p>
    </div>
  );
}

function ListItem6() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Button16 />
    </div>
  );
}

function Button17() {
  return (
    <div className="absolute h-[20px] left-0 top-[3px] w-[86.188px]" data-name="Button">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[43.5px] text-[#64748b] text-[14px] text-center text-nowrap top-[-1px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Privacy Policy
      </p>
    </div>
  );
}

function ListItem7() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Button17 />
    </div>
  );
}

function Button18() {
  return (
    <div className="absolute h-[20px] left-0 top-[3px] w-[104.688px]" data-name="Button">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[52.5px] text-[#64748b] text-[14px] text-center text-nowrap top-[-1px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Terms of Service
      </p>
    </div>
  );
}

function ListItem8() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Button18 />
    </div>
  );
}

function Button19() {
  return (
    <div className="absolute h-[20px] left-0 top-[3px] w-[78.359px]" data-name="Button">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[39.5px] text-[#64748b] text-[14px] text-center text-nowrap top-[-1px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Accessibility
      </p>
    </div>
  );
}

function ListItem9() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Button19 />
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

function Container49() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[32px] h-[266px] items-start left-[655.8px] top-0 w-[154.594px]" data-name="Container">
      <Heading4 />
      <List1 />
    </div>
  );
}

function Heading5() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Roboto:Bold',sans-serif] font-bold leading-[28px] left-0 text-[#0f172a] text-[18px] text-nowrap top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Contact
      </p>
    </div>
  );
}

function Icon15() {
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

function Text8() {
  return (
    <div className="absolute h-[20px] left-[32px] top-0 w-[151.953px]" data-name="Text">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#64748b] text-[14px] text-nowrap top-[-1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        hello@cerebrolearn.com
      </p>
    </div>
  );
}

function ListItem10() {
  return (
    <div className="h-[22px] relative shrink-0 w-full" data-name="List Item">
      <Icon15 />
      <Text8 />
    </div>
  );
}

function Icon16() {
  return (
    <div className="absolute left-0 size-[20px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_215_863)" id="Icon">
          <path d={svgPaths.p24c7c480} id="Vector" stroke="var(--stroke-0, #395192)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_215_863">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text9() {
  return (
    <div className="absolute h-[20px] left-[32px] top-0 w-[114.984px]" data-name="Text">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#64748b] text-[14px] text-nowrap top-[-1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        +1 (555) 123-4567
      </p>
    </div>
  );
}

function ListItem11() {
  return (
    <div className="h-[22px] relative shrink-0 w-full" data-name="List Item">
      <Icon16 />
      <Text9 />
    </div>
  );
}

function Icon17() {
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

function Text10() {
  return (
    <div className="absolute h-[20px] left-[32px] top-0 w-[112.266px]" data-name="Text">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#64748b] text-[14px] text-nowrap top-[-1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        San Francisco, CA
      </p>
    </div>
  );
}

function ListItem12() {
  return (
    <div className="h-[22px] relative shrink-0 w-full" data-name="List Item">
      <Icon17 />
      <Text10 />
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

function Container50() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[32px] h-[266px] items-start left-[874.39px] top-0 w-[154.594px]" data-name="Container">
      <Heading5 />
      <List2 />
    </div>
  );
}

function Container51() {
  return (
    <div className="h-[266px] relative shrink-0 w-full" data-name="Container">
      <Container47 />
      <Container48 />
      <Container49 />
      <Container50 />
    </div>
  );
}

function Icon18() {
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

function Button20() {
  return (
    <div className="bg-[#f1f5f9] relative rounded-[3.35544e+07px] shrink-0 size-[44px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon18 />
      </div>
    </div>
  );
}

function Icon19() {
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

function Button21() {
  return (
    <div className="bg-[#f1f5f9] relative rounded-[3.35544e+07px] shrink-0 size-[44px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon19 />
      </div>
    </div>
  );
}

function Icon20() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_215_883)" id="Icon">
          <path d={svgPaths.p4b98700} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p29b16f80} id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M14.5833 5.41667H14.5917" id="Vector_3" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_215_883">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button22() {
  return (
    <div className="bg-[#f1f5f9] relative rounded-[3.35544e+07px] shrink-0 size-[44px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon20 />
      </div>
    </div>
  );
}

function Icon21() {
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

function Button23() {
  return (
    <div className="bg-[#f1f5f9] relative rounded-[3.35544e+07px] shrink-0 size-[44px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon21 />
      </div>
    </div>
  );
}

function Icon22() {
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

function Button24() {
  return (
    <div className="basis-0 bg-[#f1f5f9] grow h-[44px] min-h-px min-w-px relative rounded-[3.35544e+07px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon22 />
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="h-[44px] relative shrink-0 w-[300px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[20px] items-center relative size-full">
        <Button20 />
        <Button21 />
        <Button22 />
        <Button23 />
        <Button24 />
      </div>
    </div>
  );
}

function Paragraph27() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#64748b] text-[14px] text-nowrap top-[-1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          © 2025 CerebroLearn Inc. All rights reserved.
        </p>
      </div>
    </div>
  );
}

function Button25() {
  return (
    <div className="h-[20px] relative shrink-0 w-[45.234px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[23px] text-[#64748b] text-[14px] text-center text-nowrap top-[-1px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Privacy
        </p>
      </div>
    </div>
  );
}

function Text11() {
  return (
    <div className="h-[24px] relative shrink-0 w-[5.406px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[24px] left-0 text-[#64748b] text-[16px] text-nowrap top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
          •
        </p>
      </div>
    </div>
  );
}

function Button26() {
  return (
    <div className="h-[20px] relative shrink-0 w-[39.359px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[20px] text-[#64748b] text-[14px] text-center text-nowrap top-[-1px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Terms
        </p>
      </div>
    </div>
  );
}

function Button27() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[25.5px] text-[#64748b] text-[14px] text-center text-nowrap top-[-1px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Cookies
        </p>
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div className="h-[24px] relative shrink-0 w-[225.641px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[20px] items-center relative size-full">
        <Button25 />
        <Text11 />
        <Button26 />
        <Text11 />
        <Button27 />
      </div>
    </div>
  );
}

function Container54() {
  return (
    <div className="h-[24px] relative shrink-0 w-[528.328px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[24px] items-center relative size-full">
        <Paragraph27 />
        <Container53 />
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="content-stretch flex h-[44px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container52 />
      <Container54 />
    </div>
  );
}

function Container56() {
  return (
    <div className="content-stretch flex flex-col h-[85px] items-start pb-0 pt-[41px] px-0 relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(57,81,146,0.05)] border-solid inset-0 pointer-events-none" />
      <Container55 />
    </div>
  );
}

function Container57() {
  return (
    <div className="content-stretch flex flex-col gap-[64px] h-[415px] items-start relative shrink-0 w-full" data-name="Container">
      <Container51 />
      <Container56 />
    </div>
  );
}

function Section() {
  return (
    <div className="h-[576px] relative shrink-0 w-full" data-name="Section">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(57,81,146,0.05)] border-solid inset-0 pointer-events-none" />
      <div className="size-full">
        <div className="content-stretch flex flex-col items-start pb-0 pt-[81px] px-[48px] relative size-full">
          <Container57 />
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="content-stretch flex flex-col h-[577px] items-start pb-0 pt-px px-0 relative shrink-0 w-full" data-name="Footer" style={{ backgroundImage: "linear-gradient(152.847deg, rgb(250, 251, 255) 0%, rgba(57, 81, 146, 0.05) 50%, rgba(6, 182, 212, 0.05) 100%)" }}>
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(57,81,146,0.05)] border-solid inset-0 pointer-events-none" />
      <Section />
    </div>
  );
}

function AppContent() {
  return (
    <div className="absolute bg-[#fafbff] content-stretch flex flex-col h-[2601.125px] items-start left-0 pb-0 pl-[300px] pr-0 pt-[81px] top-0 w-[1425px]" data-name="AppContent">
      <CourseCreationChoice />
      <Footer />
    </div>
  );
}

function Heading6() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Roboto:SemiBold',sans-serif] font-semibold leading-[28px] left-0 text-[#0f172a] text-[18px] text-nowrap top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Course Creator
      </p>
    </div>
  );
}

function Paragraph28() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#64748b] text-[14px] text-nowrap top-[-1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Manage your content
      </p>
    </div>
  );
}

function Container58() {
  return (
    <div className="basis-0 grow h-[48px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Heading6 />
        <Paragraph28 />
      </div>
    </div>
  );
}

function Icon23() {
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

function Button28() {
  return (
    <div className="relative rounded-[12px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon23 />
      </div>
    </div>
  );
}

function Container59() {
  return (
    <div className="content-stretch flex h-[48px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container58 />
      <Button28 />
    </div>
  );
}

function Icon24() {
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

function Container60() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-0 text-[#64748b] text-[14px] text-nowrap top-[-1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Dashboard
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
          <Icon24 />
          <Container60 />
        </div>
      </div>
    </div>
  );
}

function Icon25() {
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

function Container61() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-0 text-[14px] text-nowrap text-white top-[-1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          My Courses
        </p>
      </div>
    </div>
  );
}

function Icon26() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon" opacity="0.555342">
          <path d="M6 12L10 8L6 4" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button30() {
  return (
    <div className="bg-[#395192] h-[44px] relative rounded-[12px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[11px] items-center pl-[15px] pr-[16px] py-0 relative size-full">
          <Icon25 />
          <Container61 />
          <Icon26 />
        </div>
      </div>
    </div>
  );
}

function Icon27() {
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

function Container62() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-0 text-[#64748b] text-[14px] text-nowrap top-[-1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Analytics
        </p>
      </div>
    </div>
  );
}

function Button31() {
  return (
    <div className="h-[44px] relative rounded-[12px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[16px] py-0 relative size-full">
          <Icon27 />
          <Container62 />
        </div>
      </div>
    </div>
  );
}

function Icon28() {
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

function Container63() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-0 text-[#64748b] text-[14px] text-nowrap top-[-1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Subscribers
        </p>
      </div>
    </div>
  );
}

function Button32() {
  return (
    <div className="h-[44px] relative rounded-[12px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[16px] py-0 relative size-full">
          <Icon28 />
          <Container63 />
        </div>
      </div>
    </div>
  );
}

function Icon29() {
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

function Container64() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-0 text-[#64748b] text-[14px] text-nowrap top-[-1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Revenue
        </p>
      </div>
    </div>
  );
}

function Button33() {
  return (
    <div className="h-[44px] relative rounded-[12px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[16px] py-0 relative size-full">
          <Icon29 />
          <Container64 />
        </div>
      </div>
    </div>
  );
}

function Icon30() {
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

function Container65() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-0 text-[#64748b] text-[14px] text-nowrap top-[-1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Settings
        </p>
      </div>
    </div>
  );
}

function Button34() {
  return (
    <div className="h-[44px] relative rounded-[12px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[16px] py-0 relative size-full">
          <Icon30 />
          <Container65 />
        </div>
      </div>
    </div>
  );
}

function Navigation() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[284px] items-start relative shrink-0 w-full" data-name="Navigation">
      <Button29 />
      <Button30 />
      <Button31 />
      <Button32 />
      <Button33 />
      <Button34 />
    </div>
  );
}

function Container66() {
  return (
    <div className="h-[404px] relative shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-[24px] items-start pb-0 pt-[24px] px-[24px] relative size-full">
          <Container59 />
          <Navigation />
        </div>
      </div>
    </div>
  );
}

function CourseCreatorSidebar() {
  return (
    <div className="absolute bg-white h-[1207px] left-0 top-[80px] w-[300px]" data-name="CourseCreatorSidebar">
      <div className="content-stretch flex flex-col items-start overflow-clip pl-0 pr-px py-0 relative rounded-[inherit] size-full">
        <Container66 />
      </div>
      <div aria-hidden="true" className="absolute border-[0px_1px_0px_0px] border-[rgba(57,81,146,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon31() {
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

function Container67() {
  return (
    <div className="bg-gradient-to-b from-[#395192] relative rounded-[16px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 size-[36px] to-[#06b6d4]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon31 />
      </div>
    </div>
  );
}

function Text12() {
  return (
    <div className="basis-0 grow h-[28px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute bg-clip-text font-['Roboto:Bold',sans-serif] font-bold leading-[28px] left-[55.5px] text-[18px] text-[rgba(0,0,0,0)] text-center text-nowrap top-0 translate-x-[-50%]" style={{ WebkitTextFillColor: "transparent", fontVariationSettings: "'wdth' 100", backgroundImage: "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(rgb(57, 81, 146) 0%, rgb(6, 182, 212) 100%)" }}>
          CerebroLearn
        </p>
      </div>
    </div>
  );
}

function Button35() {
  return (
    <div className="h-[36px] relative shrink-0 w-[158.031px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container67 />
        <Text12 />
      </div>
    </div>
  );
}

function Button36() {
  return (
    <div className="h-[40px] relative rounded-[12px] shrink-0 w-[107.75px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-[54px] text-[#64748b] text-[14px] text-center text-nowrap top-[9px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Dashboard
        </p>
      </div>
    </div>
  );
}

function Button37() {
  return (
    <div className="h-[40px] relative rounded-[12px] shrink-0 w-[91.734px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-[46px] text-[#64748b] text-[14px] text-center text-nowrap top-[9px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Courses
        </p>
      </div>
    </div>
  );
}

function Button38() {
  return (
    <div className="basis-0 grow h-[40px] min-h-px min-w-px relative rounded-[12px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-[60px] text-[#64748b] text-[14px] text-center text-nowrap top-[9px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Leaderboard
        </p>
      </div>
    </div>
  );
}

function Container68() {
  return (
    <div className="basis-0 grow h-[40px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Button36 />
        <Button37 />
        <Button38 />
      </div>
    </div>
  );
}

function Container69() {
  return (
    <div className="h-[40px] relative shrink-0 w-[540.531px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[48px] items-center relative size-full">
        <Button35 />
        <Container68 />
      </div>
    </div>
  );
}

function Icon32() {
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

function Button39() {
  return (
    <div className="relative rounded-[3.35544e+07px] shrink-0 size-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon32 />
      </div>
    </div>
  );
}

function Icon33() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_215_855)" id="Icon">
          <path d={svgPaths.p23166800} id="Vector" stroke="var(--stroke-0, #F0B100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1a3c1838} id="Vector_2" stroke="var(--stroke-0, #F0B100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1b84be20} id="Vector_3" stroke="var(--stroke-0, #F0B100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2.66667 14.6667H13.3333" id="Vector_4" stroke="var(--stroke-0, #F0B100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1c3dcc70} id="Vector_5" stroke="var(--stroke-0, #F0B100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p30052a00} id="Vector_6" stroke="var(--stroke-0, #F0B100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_215_855">
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
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-0 text-[#0f172a] text-[14px] top-[-1px] w-[54px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          1250 XP
        </p>
      </div>
    </div>
  );
}

function Container70() {
  return (
    <div className="absolute bg-gradient-to-r content-stretch flex from-[rgba(173,70,255,0.1)] gap-[8px] h-[34px] items-center left-0 px-[13px] py-px rounded-[3.35544e+07px] to-[rgba(246,51,154,0.1)] top-[3px] w-[103.094px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(57,81,146,0.1)] border-solid inset-0 pointer-events-none rounded-[3.35544e+07px]" />
      <Icon33 />
      <Text13 />
    </div>
  );
}

function Text14() {
  return (
    <div className="basis-0 bg-[#f1f5f9] grow h-[40px] min-h-px min-w-px relative rounded-[3.35544e+07px] shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[#0f172a] text-[14px] text-center text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
          D
        </p>
      </div>
    </div>
  );
}

function PrimitiveSpan2() {
  return (
    <div className="absolute content-stretch flex items-start left-0 overflow-clip rounded-[3.35544e+07px] size-[40px] top-0" data-name="Primitive.span">
      <Text14 />
    </div>
  );
}

function Button40() {
  return (
    <div className="absolute left-[115.09px] rounded-[3.35544e+07px] size-[40px] top-0" data-name="Button">
      <PrimitiveSpan2 />
    </div>
  );
}

function Container71() {
  return (
    <div className="basis-0 grow h-[40px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container70 />
        <Button40 />
      </div>
    </div>
  );
}

function Container72() {
  return (
    <div className="h-[40px] relative shrink-0 w-[211.094px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[20px] items-center relative size-full">
        <Button39 />
        <Container71 />
      </div>
    </div>
  );
}

function Container73() {
  return (
    <div className="h-[80px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[48px] py-0 relative size-full">
          <Container69 />
          <Container72 />
        </div>
      </div>
    </div>
  );
}

function Navbar() {
  return (
    <div className="absolute bg-[rgba(250,251,255,0.6)] content-stretch flex flex-col h-[81px] items-start left-0 pb-px pt-0 px-0 top-0 w-[1425px]" data-name="Navbar">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(57,81,146,0.05)] border-solid inset-0 pointer-events-none shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
      <Container73 />
    </div>
  );
}

export default function CerebroLearn() {
  return (
    <div className="bg-[#fafbff] relative size-full" data-name="CerebroLearn">
      <AppContent />
      <CourseCreatorSidebar />
      <Navbar />
    </div>
  );
}