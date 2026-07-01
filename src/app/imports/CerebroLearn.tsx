import svgPaths from "./svg-sxck3lxsni";

function Heading() {
  return (
    <div className="h-[32px] relative shrink-0 w-[205.469px]" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[32px] relative w-[205.469px]">
        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[32px] left-0 text-[24px] text-nowrap text-slate-900 top-[-1px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          Create New Course
        </p>
      </div>
    </div>
  );
}

function Badge() {
  return (
    <div className="bg-cyan-500 h-[22px] relative rounded-[14px] shrink-0 w-[76.094px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[22px] items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit] w-[76.094px]">
        <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[12px] text-nowrap text-white whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          Step 1 of 4
        </p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex h-[32px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Heading />
      <Badge />
    </div>
  );
}

function Container1() {
  return <div className="bg-[#395192] h-[8px] shrink-0 w-full" data-name="Container" />;
}

function PrimitiveDiv() {
  return (
    <div className="bg-[rgba(57,81,146,0.2)] box-border content-stretch flex flex-col h-[8px] items-start overflow-clip pr-[1032px] py-0 relative rounded-[3.35544e+07px] shrink-0 w-full" data-name="Primitive.div">
      <Container1 />
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M10 5.83333V17.5" id="Vector" stroke="var(--stroke-0, #395192)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p25713000} id="Vector_2" stroke="var(--stroke-0, #395192)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container2() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative rounded-[3.35544e+07px] shrink-0 w-[40px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#395192] border-solid inset-0 pointer-events-none rounded-[3.35544e+07px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-full items-center justify-center p-[2px] relative w-[40px]">
        <Icon />
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[20px] relative shrink-0 w-[62.594px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[62.594px]">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-0 text-[14px] text-nowrap text-slate-900 top-[-1px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          Basic Info
        </p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[68px] relative shrink-0 w-[62.594px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[8px] h-[68px] items-center relative w-[62.594px]">
        <Container2 />
        <Paragraph />
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_29_1382)" id="Icon">
          <path d={svgPaths.p14d24500} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p240d7000} id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p25499600} id="Vector_3" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_29_1382">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container4() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative rounded-[3.35544e+07px] shrink-0 w-[40px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-slate-100 border-solid inset-0 pointer-events-none rounded-[3.35544e+07px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-full items-center justify-center p-[2px] relative w-[40px]">
        <Icon1 />
      </div>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[64.922px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[64.922px]">
        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[14px] text-nowrap text-slate-500 top-[-1px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          Objectives
        </p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[68px] relative shrink-0 w-[64.922px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[8px] h-[68px] items-center relative w-[64.922px]">
        <Container4 />
        <Paragraph1 />
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_29_1407)" id="Icon">
          <path d={svgPaths.p10eb4b00} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2b8b9900} id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2aadfbc0} id="Vector_3" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_29_1407">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container6() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative rounded-[3.35544e+07px] shrink-0 w-[40px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-slate-100 border-solid inset-0 pointer-events-none rounded-[3.35544e+07px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-full items-center justify-center p-[2px] relative w-[40px]">
        <Icon2 />
      </div>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[49.156px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[49.156px]">
        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[14px] text-nowrap text-slate-500 top-[-1px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          Content
        </p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[68px] relative shrink-0 w-[49.156px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[8px] h-[68px] items-center relative w-[49.156px]">
        <Container6 />
        <Paragraph2 />
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.pcfbcf00} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.pd2076c0} id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M8.33333 7.5H6.66667" id="Vector_3" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M13.3333 10.8333H6.66667" id="Vector_4" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M13.3333 14.1667H6.66667" id="Vector_5" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container8() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative rounded-[3.35544e+07px] shrink-0 w-[40px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-slate-100 border-solid inset-0 pointer-events-none rounded-[3.35544e+07px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-full items-center justify-center p-[2px] relative w-[40px]">
        <Icon3 />
      </div>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[51.125px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[51.125px]">
        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[14px] text-nowrap text-slate-500 top-[-1px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          Settings
        </p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[68px] relative shrink-0 w-[51.125px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[8px] h-[68px] items-center relative w-[51.125px]">
        <Container8 />
        <Paragraph3 />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex h-[68px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Container3 />
      <Container5 />
      <Container7 />
      <Container9 />
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[140px] items-start relative shrink-0 w-full" data-name="Container">
      <Container />
      <PrimitiveDiv />
      <Container10 />
    </div>
  );
}

function PrimitiveDiv1() {
  return <div className="bg-[rgba(57,81,146,0.1)] h-px shrink-0 w-full" data-name="Primitive.div" />;
}

function Icon4() {
  return (
    <div className="absolute left-0 size-[20px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M10 5.83333V17.5" id="Vector" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p25713000} id="Vector_2" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function CardTitle() {
  return (
    <div className="[grid-area:1_/_1] place-self-stretch relative shrink-0" data-name="CardTitle">
      <Icon4 />
      <p className="absolute font-['Roboto:SemiBold',sans-serif] font-semibold leading-[24px] left-[28px] text-[24px] text-nowrap text-slate-900 top-[-1px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Basic Information
      </p>
    </div>
  );
}

function CardDescription() {
  return (
    <div className="[grid-area:2_/_1] place-self-stretch relative shrink-0" data-name="CardDescription">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[27.2px] left-0 text-[16px] text-nowrap text-slate-500 top-0 tracking-[0.16px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Start with the fundamentals of your course
      </p>
    </div>
  );
}

function CardHeader() {
  return (
    <div className="h-[91.188px] relative shrink-0 w-[1366px]" data-name="CardHeader">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border gap-[8px] grid grid-cols-[repeat(1,_minmax(0px,_1fr))] grid-rows-[24px_minmax(0px,_1fr)] h-[91.188px] pb-0 pt-[32px] px-[32px] relative w-[1366px]">
        <CardTitle />
        <CardDescription />
      </div>
    </div>
  );
}

function PrimitiveLabel() {
  return (
    <div className="content-stretch flex gap-[8px] h-[14px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[14px] relative shrink-0 text-[14px] text-nowrap text-slate-900 whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Course Title *
      </p>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[36px] relative rounded-[14px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex h-[36px] items-center px-[12px] py-[4px] relative w-full">
          <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[14px] text-nowrap text-slate-500 whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
            e.g., Introduction to Web Development
          </p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[16px] left-0 text-[12px] text-nowrap text-slate-500 top-0 whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        A clear, descriptive title (minimum 10 characters)
      </p>
    </div>
  );
}

function CourseCreationWizard() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[82px] items-start relative shrink-0 w-full" data-name="CourseCreationWizard">
      <PrimitiveLabel />
      <Input />
      <Paragraph4 />
    </div>
  );
}

function PrimitiveLabel1() {
  return (
    <div className="content-stretch flex gap-[8px] h-[14px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[14px] relative shrink-0 text-[14px] text-nowrap text-slate-900 whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Short Description *
      </p>
    </div>
  );
}

function Input1() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[36px] relative rounded-[14px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex h-[36px] items-center px-[12px] py-[4px] relative w-full">
          <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[14px] text-nowrap text-slate-500 whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
            A brief one-liner about your course
          </p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[16px] left-0 text-[12px] text-slate-500 top-0 w-[170px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        0/100 characters (minimum 20)
      </p>
    </div>
  );
}

function CourseCreationWizard1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[82px] items-start relative shrink-0 w-full" data-name="CourseCreationWizard">
      <PrimitiveLabel1 />
      <Input1 />
      <Paragraph5 />
    </div>
  );
}

function PrimitiveLabel2() {
  return (
    <div className="content-stretch flex gap-[8px] h-[14px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[14px] relative shrink-0 text-[14px] text-nowrap text-slate-900 whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Full Description *
      </p>
    </div>
  );
}

function Textarea() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[64px] relative rounded-[14px] shrink-0 w-full" data-name="Textarea">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex h-[64px] items-start px-[12px] py-[8px] relative w-full">
          <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-nowrap text-slate-500 whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
            Provide a detailed description of what students will learn...
          </p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[16px] left-0 text-[12px] text-slate-500 top-0 w-[145px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        0 characters (minimum 50)
      </p>
    </div>
  );
}

function CourseCreationWizard2() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[110px] items-start relative shrink-0 w-full" data-name="CourseCreationWizard">
      <PrimitiveLabel2 />
      <Textarea />
      <Paragraph6 />
    </div>
  );
}

function PrimitiveLabel3() {
  return (
    <div className="content-stretch flex gap-[8px] h-[14px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[14px] relative shrink-0 text-[14px] text-nowrap text-slate-900 whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Category *
      </p>
    </div>
  );
}

function PrimitiveSpan() {
  return (
    <div className="h-[20px] relative shrink-0 w-[96.234px]" data-name="Primitive.span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[20px] items-center overflow-clip relative rounded-[inherit] w-[96.234px]">
        <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-center text-nowrap text-slate-500 whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          Select category
        </p>
      </div>
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon" opacity="0.5">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function PrimitiveButton() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[36px] relative rounded-[14px] shrink-0 w-full" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[36px] items-center justify-between px-[13px] py-px relative w-full">
          <PrimitiveSpan />
          <Icon5 />
        </div>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="[grid-area:1_/_1] content-stretch flex flex-col gap-[8px] items-start place-self-stretch relative shrink-0" data-name="Container">
      <PrimitiveLabel3 />
      <PrimitiveButton />
    </div>
  );
}

function PrimitiveLabel4() {
  return (
    <div className="content-stretch flex gap-[8px] h-[14px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[14px] relative shrink-0 text-[14px] text-nowrap text-slate-900 whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Difficulty Level *
      </p>
    </div>
  );
}

function PrimitiveSpan1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[70.219px]" data-name="Primitive.span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[20px] items-center overflow-clip relative rounded-[inherit] w-[70.219px]">
        <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-center text-nowrap text-slate-500 whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          Select level
        </p>
      </div>
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon" opacity="0.5">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function PrimitiveButton1() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[36px] relative rounded-[14px] shrink-0 w-full" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[36px] items-center justify-between px-[13px] py-px relative w-full">
          <PrimitiveSpan1 />
          <Icon6 />
        </div>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="[grid-area:1_/_2] content-stretch flex flex-col gap-[8px] items-start place-self-stretch relative shrink-0" data-name="Container">
      <PrimitiveLabel4 />
      <PrimitiveButton1 />
    </div>
  );
}

function CourseCreationWizard3() {
  return (
    <div className="gap-[16px] grid grid-cols-[repeat(2,_minmax(0px,_1fr))] grid-rows-[repeat(1,_minmax(0px,_1fr))] h-[58px] relative shrink-0 w-full" data-name="CourseCreationWizard">
      <Container12 />
      <Container13 />
    </div>
  );
}

function Icon7() {
  return (
    <div className="absolute left-[17px] size-[16px] top-[15px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_29_1443)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 10.6667V8" id="Vector_2" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 5.33333H8.00667" id="Vector_3" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_29_1443">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function AlertDescription() {
  return (
    <div className="absolute h-[20px] left-[45px] top-[13px] w-[1240px]" data-name="AlertDescription">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[14px] text-nowrap text-slate-500 top-[-1px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Choose the category and level that best match your course content. This helps students find your course.
      </p>
    </div>
  );
}

function Alert() {
  return (
    <div className="bg-white h-[46px] relative rounded-[16px] shrink-0 w-full" data-name="Alert">
      <div aria-hidden="true" className="absolute border border-[rgba(57,81,146,0.1)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Icon7 />
      <AlertDescription />
    </div>
  );
}

function CardContent() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[1366px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[24px] h-full items-start px-[32px] py-0 relative w-[1366px]">
        <CourseCreationWizard />
        <CourseCreationWizard1 />
        <CourseCreationWizard2 />
        <CourseCreationWizard3 />
        <Alert />
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="bg-white h-[639.188px] relative rounded-[20px] shrink-0 w-full" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[rgba(57,81,146,0.1)] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[32px] h-[639.188px] items-start pl-[5px] pr-px py-[5px] relative w-full">
          <CardHeader />
          <CardContent />
        </div>
      </div>
    </div>
  );
}

function Icon8() {
  return (
    <div className="absolute left-[13px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p203476e0} id="Vector" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M12.6667 8H3.33333" id="Vector_2" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[36px] relative rounded-[14px] shrink-0 w-[100.859px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[36px] relative w-[100.859px]">
        <Icon8 />
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-[66.5px] text-[14px] text-center text-nowrap text-slate-900 top-[7px] translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          Cancel
        </p>
      </div>
    </div>
  );
}

function Icon9() {
  return (
    <div className="absolute left-[57.14px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M3.33333 8H12.6667" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1d405500} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#395192] h-[36px] relative rounded-[14px] shrink-0 w-[85.141px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[36px] relative w-[85.141px]">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-[27px] text-[14px] text-center text-nowrap text-white top-[7px] translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          Next
        </p>
        <Icon9 />
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="box-border content-stretch flex h-[61px] items-center justify-between pb-0 pt-px px-0 relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(57,81,146,0.1)] border-solid inset-0 pointer-events-none" />
      <Button />
      <Button1 />
    </div>
  );
}

function CourseCreationWizard4() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] h-[913.188px] items-start relative shrink-0 w-full" data-name="CourseCreationWizard">
      <Container11 />
      <PrimitiveDiv1 />
      <Card />
      <Container14 />
    </div>
  );
}

function CourseCreatorDashboard() {
  return (
    <div className="absolute bg-gradient-to-b box-border content-stretch flex flex-col from-[#fafbff] h-[1304px] items-start left-[256px] pb-0 pt-[32px] px-[268.5px] to-[#fafbff] top-[65px] via-50% via-[rgba(240,249,255,0.3)] w-[1913px]" data-name="CourseCreatorDashboard">
      <CourseCreationWizard4 />
    </div>
  );
}

function Icon10() {
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

function Container15() {
  return (
    <div className="bg-gradient-to-b from-[#395192] relative rounded-[20px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 size-[40px] to-[#06b6d4]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[40px]">
        <Icon10 />
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[28px] relative shrink-0 w-[122.25px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[28px] relative w-[122.25px]">
        <p className="absolute bg-clip-text font-['Roboto:Bold',sans-serif] font-bold leading-[28px] left-0 text-[20px] text-nowrap text-slate-900 top-[-1px] whitespace-pre" style={{ WebkitTextFillColor: "transparent", fontVariationSettings: "'wdth' 100", backgroundImage: "linear-gradient(90deg, rgb(15, 23, 42) 0%, rgb(15, 23, 42) 100%), linear-gradient(167.176deg, rgb(57, 81, 146) 0%, rgb(6, 182, 212) 100%)" }}>
          CerebroLearn
        </p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex gap-[12px] h-[40px] items-center relative shrink-0 w-full" data-name="Container">
      <Container15 />
      <Text />
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="h-[78px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[26px] left-0 text-[16px] text-slate-500 top-0 w-[438px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Transforming online education with accessible, engaging, and interactive learning experiences. Join thousands of learners worldwide.
      </p>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[24px] left-0 text-[16px] text-nowrap text-slate-900 top-0 whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Subscribe to our newsletter
      </p>
    </div>
  );
}

function Input2() {
  return (
    <div className="basis-0 bg-[rgba(0,0,0,0)] grow h-[44px] min-h-px min-w-px relative rounded-[14px] shrink-0" data-name="Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[44px] items-center px-[12px] py-[4px] relative w-full">
          <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[14px] text-nowrap text-slate-500 whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
            Enter your email
          </p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(57,81,146,0.05)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Icon11() {
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

function Button2() {
  return (
    <div className="bg-[#395192] relative rounded-[14px] shrink-0 size-[44px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[44px]">
        <Icon11 />
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex gap-[12px] h-[44px] items-start relative shrink-0 w-full" data-name="Container">
      <Input2 />
      <Button2 />
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[84px] items-start relative shrink-0 w-full" data-name="Container">
      <Paragraph8 />
      <Container17 />
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[32px] h-[266px] items-start left-0 top-0 w-[473.594px]" data-name="Container">
      <Container16 />
      <Paragraph7 />
      <Container18 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Roboto:Bold',sans-serif] font-bold leading-[28px] left-0 text-[18px] text-nowrap text-slate-900 top-0 whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Explore
      </p>
    </div>
  );
}

function Button3() {
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
      <Button3 />
    </div>
  );
}

function Button4() {
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
      <Button4 />
    </div>
  );
}

function Button5() {
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
      <Button5 />
    </div>
  );
}

function Button6() {
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
      <Button6 />
    </div>
  );
}

function Button7() {
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
      <Button7 />
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

function Container20() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[32px] h-[266px] items-start left-[537.59px] top-0 w-[204.797px]" data-name="Container">
      <Heading1 />
      <List />
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Roboto:Bold',sans-serif] font-bold leading-[28px] left-0 text-[18px] text-nowrap text-slate-900 top-0 whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Support
      </p>
    </div>
  );
}

function Button8() {
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
      <Button8 />
    </div>
  );
}

function Button9() {
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
      <Button9 />
    </div>
  );
}

function Button10() {
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
      <Button10 />
    </div>
  );
}

function Button11() {
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
      <Button11 />
    </div>
  );
}

function Button12() {
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
      <Button12 />
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

function Container21() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[32px] h-[266px] items-start left-[806.39px] top-0 w-[204.797px]" data-name="Container">
      <Heading2 />
      <List1 />
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Roboto:Bold',sans-serif] font-bold leading-[28px] left-0 text-[18px] text-nowrap text-slate-900 top-0 whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Contact
      </p>
    </div>
  );
}

function Icon12() {
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

function Text1() {
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
      <Icon12 />
      <Text1 />
    </div>
  );
}

function Icon13() {
  return (
    <div className="absolute left-0 size-[20px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_29_1432)" id="Icon">
          <path d={svgPaths.p24c7c480} id="Vector" stroke="var(--stroke-0, #395192)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_29_1432">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text2() {
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
      <Icon13 />
      <Text2 />
    </div>
  );
}

function Icon14() {
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

function Text3() {
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
      <Icon14 />
      <Text3 />
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

function Container22() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[32px] h-[266px] items-start left-[1075.19px] top-0 w-[204.813px]" data-name="Container">
      <Heading3 />
      <List2 />
    </div>
  );
}

function Container23() {
  return (
    <div className="h-[266px] relative shrink-0 w-full" data-name="Container">
      <Container19 />
      <Container20 />
      <Container21 />
      <Container22 />
    </div>
  );
}

function Icon15() {
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

function Button13() {
  return (
    <div className="bg-slate-100 relative rounded-[3.35544e+07px] shrink-0 size-[44px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[44px]">
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
          <path d={svgPaths.p188b5880} fill="var(--fill-0, #64748B)" id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button14() {
  return (
    <div className="bg-slate-100 relative rounded-[3.35544e+07px] shrink-0 size-[44px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[44px]">
        <Icon16 />
      </div>
    </div>
  );
}

function Icon17() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_29_1364)" id="Icon">
          <path d={svgPaths.p4b98700} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p29b16f80} id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M14.5833 5.41667H14.5917" id="Vector_3" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_29_1364">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button15() {
  return (
    <div className="bg-slate-100 relative rounded-[3.35544e+07px] shrink-0 size-[44px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[44px]">
        <Icon17 />
      </div>
    </div>
  );
}

function Icon18() {
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

function Button16() {
  return (
    <div className="bg-slate-100 relative rounded-[3.35544e+07px] shrink-0 size-[44px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[44px]">
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
          <path d={svgPaths.pd45be00} fill="var(--fill-0, #64748B)" id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p212a8900} fill="var(--fill-0, #64748B)" id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button17() {
  return (
    <div className="basis-0 bg-slate-100 grow h-[44px] min-h-px min-w-px relative rounded-[3.35544e+07px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[44px] items-center justify-center relative w-full">
        <Icon19 />
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="h-[44px] relative shrink-0 w-[300px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[20px] h-[44px] items-center relative w-[300px]">
        <Button13 />
        <Button14 />
        <Button15 />
        <Button16 />
        <Button17 />
      </div>
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-full">
        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[14px] text-nowrap text-slate-500 top-[-1px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          © 2025 CerebroLearn Inc. All rights reserved.
        </p>
      </div>
    </div>
  );
}

function Button18() {
  return (
    <div className="h-[20px] relative shrink-0 w-[45.234px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[45.234px]">
        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[23px] text-[14px] text-center text-nowrap text-slate-500 top-[-1px] translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          Privacy
        </p>
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[24px] relative shrink-0 w-[5.406px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-[5.406px]">
        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[24px] left-0 text-[16px] text-nowrap text-slate-500 top-0 whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          •
        </p>
      </div>
    </div>
  );
}

function Button19() {
  return (
    <div className="h-[20px] relative shrink-0 w-[39.359px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[39.359px]">
        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[20px] text-[14px] text-center text-nowrap text-slate-500 top-[-1px] translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          Terms
        </p>
      </div>
    </div>
  );
}

function Button20() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-full">
        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[25.5px] text-[14px] text-center text-nowrap text-slate-500 top-[-1px] translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          Cookies
        </p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="h-[24px] relative shrink-0 w-[225.641px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[20px] h-[24px] items-center relative w-[225.641px]">
        <Button18 />
        <Text4 />
        <Button19 />
        <Text4 />
        <Button20 />
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="h-[24px] relative shrink-0 w-[528.328px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[24px] h-[24px] items-center relative w-[528.328px]">
        <Paragraph9 />
        <Container25 />
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex h-[44px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container24 />
      <Container26 />
    </div>
  );
}

function Container28() {
  return (
    <div className="box-border content-stretch flex flex-col h-[85px] items-start pb-0 pt-[41px] px-0 relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(57,81,146,0.05)] border-solid inset-0 pointer-events-none" />
      <Container27 />
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex flex-col gap-[64px] h-[415px] items-start relative shrink-0 w-full" data-name="Container">
      <Container23 />
      <Container28 />
    </div>
  );
}

function Section() {
  return (
    <div className="h-[576px] relative shrink-0 w-full" data-name="Section">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(57,81,146,0.05)] border-solid inset-0 pointer-events-none" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col h-[576px] items-start pb-0 pt-[81px] px-[444.5px] relative w-full">
          <Container29 />
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="absolute box-border content-stretch flex flex-col h-[577px] items-start left-[256px] pb-0 pt-px px-0 top-[1369px] w-[2169px]" data-name="Footer">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(57,81,146,0.05)] border-solid inset-0 pointer-events-none" />
      <Section />
    </div>
  );
}

function AppContent() {
  return (
    <div className="absolute bg-[#fafbff] h-[1946px] left-0 top-0 w-[2169px]" data-name="AppContent">
      <CourseCreatorDashboard />
      <Footer />
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Roboto:SemiBold',sans-serif] font-semibold leading-[28px] left-0 text-[18px] text-nowrap text-slate-900 top-0 whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Course Creator
      </p>
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[14px] text-nowrap text-slate-500 top-[-1px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Manage your content
      </p>
    </div>
  );
}

function Container30() {
  return (
    <div className="content-stretch flex flex-col h-[48px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading4 />
      <Paragraph10 />
    </div>
  );
}

function Icon20() {
  return (
    <div className="relative shrink-0 size-[22px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g id="Icon">
          <path d={svgPaths.p1c0b9000} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83333" />
          <path d={svgPaths.p3b297600} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83333" />
          <path d={svgPaths.p3c226200} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83333" />
          <path d={svgPaths.p1cf4c480} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83333" />
        </g>
      </svg>
    </div>
  );
}

function Container31() {
  return (
    <div className="h-[20px] relative shrink-0 w-[115px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[115px]">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-0 text-[14px] text-nowrap text-white top-[-1px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          Dashboard
        </p>
      </div>
    </div>
  );
}

function Icon21() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon" opacity="0.791303">
          <path d="M6 12L10 8L6 4" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button21() {
  return (
    <div className="bg-[#395192] h-[44px] relative rounded-[16px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[11px] h-[44px] items-center pl-[15px] pr-0 py-0 relative w-full">
          <Icon20 />
          <Container31 />
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
          <path d="M10 5.83333V17.5" id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p25713000} id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container32() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-0 text-[14px] text-nowrap text-slate-500 top-[-1px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        My Courses
      </p>
    </div>
  );
}

function Container33() {
  return (
    <div className="h-[16px] opacity-0 relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[16px] left-0 text-[12px] text-nowrap text-slate-500 top-0 whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Manage your courses
      </p>
    </div>
  );
}

function Container34() {
  return (
    <div className="basis-0 grow h-[36px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[36px] items-start relative w-full">
        <Container32 />
        <Container33 />
      </div>
    </div>
  );
}

function Button22() {
  return (
    <div className="h-[60px] relative rounded-[16px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[12px] h-[60px] items-center px-[16px] py-0 relative w-full">
          <Icon22 />
          <Container34 />
        </div>
      </div>
    </div>
  );
}

function Icon23() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_29_1420)" id="Icon">
          <path d={svgPaths.p14d24500} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M6.66667 10H13.3333" id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 6.66667V13.3333" id="Vector_3" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_29_1420">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container35() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-0 text-[14px] text-nowrap text-slate-500 top-[-1px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Create Course
      </p>
    </div>
  );
}

function Container36() {
  return (
    <div className="h-[16px] opacity-0 relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[16px] left-0 text-[12px] text-nowrap text-slate-500 top-0 whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Start a new course
      </p>
    </div>
  );
}

function Container37() {
  return (
    <div className="basis-0 grow h-[36px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[36px] items-start relative w-full">
        <Container35 />
        <Container36 />
      </div>
    </div>
  );
}

function Button23() {
  return (
    <div className="h-[60px] relative rounded-[16px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[12px] h-[60px] items-center px-[16px] py-0 relative w-full">
          <Icon23 />
          <Container37 />
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
          <path d={svgPaths.p140c1100} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M15 14.1667V7.5" id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10.8333 14.1667V4.16667" id="Vector_3" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M6.66667 14.1667V11.6667" id="Vector_4" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container38() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-0 text-[14px] text-nowrap text-slate-500 top-[-1px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Analytics
      </p>
    </div>
  );
}

function Container39() {
  return (
    <div className="h-[16px] opacity-0 relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[16px] left-0 text-[12px] text-nowrap text-slate-500 top-0 whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Course performance
      </p>
    </div>
  );
}

function Container40() {
  return (
    <div className="basis-0 grow h-[36px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[36px] items-start relative w-full">
        <Container38 />
        <Container39 />
      </div>
    </div>
  );
}

function Button24() {
  return (
    <div className="h-[60px] relative rounded-[16px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[12px] h-[60px] items-center px-[16px] py-0 relative w-full">
          <Icon24 />
          <Container40 />
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
          <path d={svgPaths.p25397b80} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p18406864} id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2241fff0} id="Vector_3" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2c4f400} id="Vector_4" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container41() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-0 text-[14px] text-nowrap text-slate-500 top-[-1px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Subscribers
      </p>
    </div>
  );
}

function Container42() {
  return (
    <div className="h-[16px] opacity-0 relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[16px] left-0 text-[12px] text-nowrap text-slate-500 top-0 whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        View enrolled learners
      </p>
    </div>
  );
}

function Container43() {
  return (
    <div className="basis-0 grow h-[36px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[36px] items-start relative w-full">
        <Container41 />
        <Container42 />
      </div>
    </div>
  );
}

function Button25() {
  return (
    <div className="h-[60px] relative rounded-[16px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[12px] h-[60px] items-center px-[16px] py-0 relative w-full">
          <Icon25 />
          <Container43 />
        </div>
      </div>
    </div>
  );
}

function Icon26() {
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

function Container44() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-0 text-[14px] text-nowrap text-slate-500 top-[-1px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Revenue
      </p>
    </div>
  );
}

function Container45() {
  return (
    <div className="h-[16px] opacity-0 relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[16px] left-0 text-[12px] text-nowrap text-slate-500 top-0 whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>{`Earnings & payouts`}</p>
    </div>
  );
}

function Container46() {
  return (
    <div className="basis-0 grow h-[36px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[36px] items-start relative w-full">
        <Container44 />
        <Container45 />
      </div>
    </div>
  );
}

function Button26() {
  return (
    <div className="h-[60px] relative rounded-[16px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[12px] h-[60px] items-center px-[16px] py-0 relative w-full">
          <Icon26 />
          <Container46 />
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
          <path d={svgPaths.p15ab6200} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3b27f100} id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container47() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-0 text-[14px] text-nowrap text-slate-500 top-[-1px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Settings
      </p>
    </div>
  );
}

function Container48() {
  return (
    <div className="h-[16px] opacity-0 relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[16px] left-0 text-[12px] text-nowrap text-slate-500 top-0 whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>{`Profile & preferences`}</p>
    </div>
  );
}

function Container49() {
  return (
    <div className="basis-0 grow h-[36px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[36px] items-start relative w-full">
        <Container47 />
        <Container48 />
      </div>
    </div>
  );
}

function Button27() {
  return (
    <div className="h-[60px] relative rounded-[16px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[12px] h-[60px] items-center px-[16px] py-0 relative w-full">
          <Icon27 />
          <Container49 />
        </div>
      </div>
    </div>
  );
}

function Navigation() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[428px] items-start relative shrink-0 w-full" data-name="Navigation">
      <Button21 />
      <Button22 />
      <Button23 />
      <Button24 />
      <Button25 />
      <Button26 />
      <Button27 />
    </div>
  );
}

function Container50() {
  return (
    <div className="h-[548px] relative shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] h-[548px] items-start pb-0 pt-[24px] px-[24px] relative w-full">
          <Container30 />
          <Navigation />
        </div>
      </div>
    </div>
  );
}

function CourseCreatorSidebar() {
  return (
    <div className="absolute bg-white h-[1240px] left-0 top-[64px] w-[256px]" data-name="CourseCreatorSidebar">
      <div className="box-border content-stretch flex flex-col h-[1240px] items-start overflow-clip pl-0 pr-px py-0 relative rounded-[inherit] w-[256px]">
        <Container50 />
      </div>
      <div aria-hidden="true" className="absolute border-[0px_1px_0px_0px] border-[rgba(57,81,146,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon28() {
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

function Container51() {
  return (
    <div className="bg-gradient-to-b from-[#395192] relative rounded-[20px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 size-[36px] to-[#06b6d4]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[36px]">
        <Icon28 />
      </div>
    </div>
  );
}

function Text5() {
  return (
    <div className="basis-0 grow h-[28px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[28px] relative w-full">
        <p className="absolute bg-clip-text font-['Roboto:Bold',sans-serif] font-bold leading-[28px] left-[55.5px] text-[18px] text-[rgba(0,0,0,0)] text-center text-nowrap top-0 translate-x-[-50%] whitespace-pre" style={{ WebkitTextFillColor: "transparent", fontVariationSettings: "'wdth' 100", backgroundImage: "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(rgb(57, 81, 146) 0%, rgb(6, 182, 212) 100%)" }}>
          CerebroLearn
        </p>
      </div>
    </div>
  );
}

function Button28() {
  return (
    <div className="h-[36px] relative shrink-0 w-[158.031px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[12px] h-[36px] items-center relative w-[158.031px]">
        <Container51 />
        <Text5 />
      </div>
    </div>
  );
}

function Button29() {
  return (
    <div className="h-[40px] relative rounded-[16px] shrink-0 w-[107.75px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[40px] relative w-[107.75px]">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-[54px] text-[14px] text-center text-nowrap text-slate-500 top-[9px] translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          Dashboard
        </p>
      </div>
    </div>
  );
}

function Button30() {
  return (
    <div className="h-[40px] relative rounded-[16px] shrink-0 w-[91.734px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[40px] relative w-[91.734px]">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-[46px] text-[14px] text-center text-nowrap text-slate-500 top-[9px] translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          Courses
        </p>
      </div>
    </div>
  );
}

function Button31() {
  return (
    <div className="basis-0 grow h-[40px] min-h-px min-w-px relative rounded-[16px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[40px] relative w-full">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-[60px] text-[14px] text-center text-nowrap text-slate-500 top-[9px] translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          Leaderboard
        </p>
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="basis-0 grow h-[40px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[40px] items-center relative w-full">
        <Button29 />
        <Button30 />
        <Button31 />
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div className="h-[40px] relative shrink-0 w-[532.531px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[40px] h-[40px] items-center relative w-[532.531px]">
        <Button28 />
        <Container52 />
      </div>
    </div>
  );
}

function Icon29() {
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

function Button32() {
  return (
    <div className="relative rounded-[3.35544e+07px] shrink-0 size-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[36px]">
        <Icon29 />
      </div>
    </div>
  );
}

function Icon30() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_29_1455)" id="Icon">
          <path d={svgPaths.p23166800} id="Vector" stroke="var(--stroke-0, #F0B100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1a3c1838} id="Vector_2" stroke="var(--stroke-0, #F0B100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1b84be20} id="Vector_3" stroke="var(--stroke-0, #F0B100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2.66667 14.6667H13.3333" id="Vector_4" stroke="var(--stroke-0, #F0B100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1c3dcc70} id="Vector_5" stroke="var(--stroke-0, #F0B100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p30052a00} id="Vector_6" stroke="var(--stroke-0, #F0B100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_29_1455">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text6() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-full">
        <p className="absolute font-['Roboto:Medium',sans-serif] font-medium leading-[20px] left-0 text-[14px] text-slate-900 top-[-1px] w-[30px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          0 XP
        </p>
      </div>
    </div>
  );
}

function Container54() {
  return (
    <div className="absolute bg-gradient-to-r box-border content-stretch flex from-[rgba(173,70,255,0.1)] gap-[8px] h-[34px] items-center left-0 px-[13px] py-px rounded-[3.35544e+07px] to-[rgba(246,51,154,0.1)] top-[3px] w-[79.234px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(57,81,146,0.1)] border-solid inset-0 pointer-events-none rounded-[3.35544e+07px]" />
      <Icon30 />
      <Text6 />
    </div>
  );
}

function Text7() {
  return (
    <div className="basis-0 bg-slate-100 grow h-[40px] min-h-px min-w-px relative rounded-[3.35544e+07px] shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[40px] items-center justify-center relative w-full">
        <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[14px] text-center text-nowrap text-slate-900 whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          D
        </p>
      </div>
    </div>
  );
}

function PrimitiveSpan2() {
  return (
    <div className="absolute content-stretch flex items-start left-0 overflow-clip rounded-[3.35544e+07px] size-[40px] top-0" data-name="Primitive.span">
      <Text7 />
    </div>
  );
}

function Button33() {
  return (
    <div className="absolute left-[91.23px] rounded-[3.35544e+07px] size-[40px] top-0" data-name="Button">
      <PrimitiveSpan2 />
    </div>
  );
}

function Container55() {
  return (
    <div className="basis-0 grow h-[40px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[40px] relative w-full">
        <Container54 />
        <Button33 />
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div className="h-[40px] relative shrink-0 w-[187.234px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[20px] h-[40px] items-center relative w-[187.234px]">
        <Button32 />
        <Container55 />
      </div>
    </div>
  );
}

function Container57() {
  return (
    <div className="h-[64px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[64px] items-center justify-between px-[24px] py-0 relative w-full">
          <Container53 />
          <Container56 />
        </div>
      </div>
    </div>
  );
}

function Navbar() {
  return (
    <div className="absolute bg-[rgba(250,251,255,0.6)] box-border content-stretch flex flex-col h-[65px] items-start left-0 pb-px pt-0 px-[316.5px] top-0 w-[2169px]" data-name="Navbar">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(57,81,146,0.05)] border-solid inset-0 pointer-events-none shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
      <Container57 />
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