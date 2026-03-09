import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import pptxgen from "pptxgenjs";
import { 
  Coffee, 
  Award, 
  Settings, 
  TrendingUp, 
  Users, 
  ChevronDown,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  CheckCircle2,
  Edit3,
  Save,
  Upload,
  Image as ImageIcon,
  Download
} from 'lucide-react';

// --- Types ---

interface PortfolioData {
  name: string;
  profileImage: string;
  aboutText1: string;
  aboutText2: string;
  experiences: { title: string; date: string; desc: string }[];
  skills: { title: string; desc: string }[];
  philosophy1: string;
  philosophy2: string;
  closingText1: string;
  closingText2: string;
  bgImage: string;
}

// --- Components ---

const Section = ({ children, id, className = "" }: { children: React.ReactNode, id: string, className?: string }) => (
  <section id={id} className={`snap-section relative w-full flex flex-col items-center justify-center overflow-hidden ${className}`}>
    {children}
  </section>
);

const Title = ({ children, light = false }: { children: React.ReactNode, light?: boolean }) => (
  <motion.h2 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className={`font-display text-4xl md:text-5xl font-bold mb-12 ${light ? 'text-white' : 'text-bana-purple'}`}
  >
    {children}
  </motion.h2>
);

const EditableText = ({ 
  value, 
  onChange, 
  isEditing, 
  className = "", 
  multiline = false 
}: { 
  value: string; 
  onChange: (val: string) => void; 
  isEditing: boolean; 
  className?: string;
  multiline?: boolean;
}) => {
  if (!isEditing) return <span className={className}>{value}</span>;
  
  return multiline ? (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full bg-white/10 border border-white/20 rounded p-2 focus:outline-none focus:border-bana-purple text-inherit ${className}`}
      rows={4}
    />
  ) : (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`bg-white/10 border border-white/20 rounded px-2 py-1 focus:outline-none focus:border-bana-purple text-inherit ${className}`}
    />
  );
};

const ImageUpload = ({ 
  onUpload, 
  isEditing, 
  className = "" 
}: { 
  onUpload: (url: string) => void; 
  isEditing: boolean;
  className?: string;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isEditing) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-20 ${className}`}>
      <button 
        onClick={() => fileInputRef.current?.click()}
        className="bg-white text-bana-purple p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
      >
        <Upload size={24} />
      </button>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*"
      />
    </div>
  );
};

export default function App() {
  const [activeSection, setActiveSection] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  
  const [data, setData] = useState<PortfolioData>({
    name: "[지원자 이름]",
    profileImage: "https://picsum.photos/seed/barista/800/1200",
    bgImage: "https://picsum.photos/seed/coffee-art/1920/1080",
    aboutText1: "로스터리 카페 운영 경험과 해외 카페 매니저 경험을 통해 커피와 음료에 대한 이해도를 쌓아왔습니다. 다양한 카페 환경에서 근무하며 커피의 풍미와 음료의 밸런스를 중요하게 생각하게 되었고, 매장에서 고객이 즐길 수 있는 음료를 만드는 과정에 흥미를 느끼게 되었습니다.",
    aboutText2: "현장 경험을 바탕으로 브랜드에 어울리는 메뉴 개발에 기여하고 싶습니다. 단순한 트렌드를 넘어, 브랜드의 정체성과 운영의 효율성을 동시에 잡는 메뉴를 제안합니다.",
    experiences: [
      { title: "호주 카페 매니저", date: "2024.12 ~ 2025.11", desc: "Global Cafe Management & Service" },
      { title: "개인 카페 매장 운영", date: "2021.04 ~ 2023.07", desc: "Roastery Cafe Operation & Menu Development" },
      { title: "메가커피 수원아주대점", date: "2020.09 ~ 2021.03", desc: "High-volume Franchise Operation" },
      { title: "투썸플레이스 수원북문점", date: "2018.09 ~ 2019.11", desc: "Premium Dessert Cafe Management" },
      { title: "투썸플레이스 수원드라마센터점", date: "2017.02 ~ 2017.08", desc: "Store Operation & Quality Control" },
      { title: "서동진의 커피랩", date: "2013.09 ~ 2014.12", desc: "Coffee Research & Brewing" }
    ],
    skills: [
      { title: "Coffee Roasting", desc: "원두의 특성을 살리는 로스팅 프로파일 설계" },
      { title: "Cupping & Flavor", desc: "섬세한 관능 평가를 통한 맛의 밸런스 도출" },
      { title: "Extraction Setting", desc: "최적의 에스프레소 추출 환경 세팅 및 유지" },
      { title: "Beverage Balance", desc: "재료 간의 조화를 고려한 음료 레시피 개발" },
      { title: "Operation Mgmt", desc: "매장 운영 효율성을 고려한 메뉴 프로세스 설계" }
    ],
    philosophy1: "카페 현장에서의 경험을 통해 커피와 음료의 맛 밸런스를 이해하는 것이 중요하다고 생각합니다. 단순히 새로운 음료를 만드는 것이 아니라 고객의 취향과 브랜드 이미지, 매장에서의 운영 효율성까지 고려한 메뉴 개발이 필요합니다.",
    philosophy2: "현장에서 쌓은 경험을 바탕으로 고객에게 좋은 경험을 제공할 수 있는 메뉴를 만드는 것을 목표로 합니다.",
    closingText1: "바나프레소는 트렌디한 메뉴와 빠르게 변화하는 카페 시장에 유연하게 대응하는 브랜드라고 생각합니다. 다양한 매장 경험과 커피에 대한 이해를 바탕으로 브랜드에 어울리는 메뉴 개발에 기여하고 싶습니다.",
    closingText2: "현장에서 쌓은 경험을 기반으로 고객에게 새로운 경험을 제공할 수 있는 메뉴개발자가 되고 싶습니다."
  });

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.snap-section');
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top >= -window.innerHeight / 2 && rect.top <= window.innerHeight / 2) {
          setActiveSection(index);
        }
      });
    };

    const container = document.querySelector('.snap-container');
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

  const updateData = (key: keyof PortfolioData, value: any) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const newExps = [...data.experiences];
    newExps[index] = { ...newExps[index], [field]: value };
    updateData('experiences', newExps);
  };

  const updateSkill = (index: number, field: string, value: string) => {
    const newSkills = [...data.skills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    updateData('skills', newSkills);
  };

  const generatePPTX = () => {
    let pptx = new pptxgen();
    pptx.layout = "LAYOUT_WIDE"; // 13.33 x 7.5 inches

    const BANA_PURPLE = "702182";
    const TEXT_DARK = "1E293B"; // Slate 800
    const TEXT_GRAY = "64748B"; // Slate 500
    const BANA_LIGHT = "F8F4F9";
    const WHITE = "FFFFFF";

    // Helper for Section Titles
    const addSectionTitle = (slide: any, sub: string, main: string, isLight: boolean = false) => {
      slide.addText(sub, { 
        x: 0, y: 0.6, w: "100%", align: "center", color: isLight ? WHITE : BANA_PURPLE, fontSize: 12, bold: true, fontFace: "Arial", charSpacing: 4 
      });
      slide.addText(main, { 
        x: 0, y: 1.0, w: "100%", align: "center", color: isLight ? WHITE : BANA_PURPLE, fontSize: 32, bold: true, fontFace: "Malgun Gothic" 
      });
    };

    // 1. Cover
    let slide1 = pptx.addSlide();
    slide1.background = { color: BANA_PURPLE };
    
    // Abstract background shapes (mimicking the blur)
    slide1.addShape(pptx.ShapeType.ellipse, { x: -1, y: -1, w: 5, h: 5, fill: { color: WHITE, transparency: 90 } });
    slide1.addShape(pptx.ShapeType.ellipse, { x: 9, y: 4, w: 5, h: 5, fill: { color: WHITE, transparency: 90 } });

    slide1.addText("바나프레소 메뉴개발 직무 지원", { 
      x: 0, y: 2.2, w: "100%", align: "center", color: WHITE, fontSize: 16, bold: true, fontFace: "Malgun Gothic", charSpacing: 4
    });
    slide1.addText("Menu Development\nPortfolio", { 
      x: 0, y: 2.8, w: "100%", align: "center", color: WHITE, fontSize: 64, bold: true, fontFace: "Arial" 
    });
    slide1.addShape(pptx.ShapeType.rect, { x: 6.1, y: 5.2, w: 1.1, h: 0.05, fill: { color: WHITE } });
    slide1.addText(`Applicant: ${data.name}`, { 
      x: 0, y: 5.8, w: "100%", align: "center", color: WHITE, fontSize: 22, fontFace: "Malgun Gothic", charSpacing: 2
    });

    // 2. About Me
    let slide2 = pptx.addSlide();
    addSectionTitle(slide2, "ABOUT ME", "커피와 음료의 본질을 이해하는 개발자");
    
    // Profile Card Style
    slide2.addShape(pptx.ShapeType.rect, { x: 0.8, y: 1.8, w: 3.8, h: 5.0, fill: { color: BANA_LIGHT }, line: { color: BANA_PURPLE, width: 0.5 } });
    slide2.addImage({ path: data.profileImage, x: 1.0, y: 2.0, w: 3.4, h: 4.6 });
    
    // Content
    slide2.addText(data.aboutText1, { 
      x: 5.2, y: 2.0, w: 7.2, fontSize: 16, color: TEXT_DARK, fontFace: "Malgun Gothic", lineSpacing: 24 
    });
    slide2.addText(data.aboutText2, { 
      x: 5.2, y: 4.2, w: 7.2, fontSize: 16, color: TEXT_DARK, fontFace: "Malgun Gothic", lineSpacing: 24 
    });

    // Contact Info
    slide2.addShape(pptx.ShapeType.rect, { x: 5.2, y: 6.2, w: 3.5, h: 0.6, fill: { color: BANA_LIGHT } });
    slide2.addText("dukhee0522@gmail.com", { x: 5.4, y: 6.35, fontSize: 12, color: TEXT_GRAY, fontFace: "Arial" });
    
    slide2.addShape(pptx.ShapeType.rect, { x: 8.9, y: 6.2, w: 3.5, h: 0.6, fill: { color: BANA_LIGHT } });
    slide2.addText("경기도 수원시", { x: 9.1, y: 6.35, fontSize: 12, color: TEXT_GRAY, fontFace: "Malgun Gothic" });

    // 3. Experience (Timeline Style)
    let slide3 = pptx.addSlide();
    slide3.background = { color: BANA_LIGHT };
    addSectionTitle(slide3, "EXPERIENCE", "Professional Journey");
    
    // Timeline Line
    slide3.addShape(pptx.ShapeType.line, { x: 6.66, y: 1.8, w: 0, h: 5.2, line: { color: BANA_PURPLE, width: 1 } });

    data.experiences.forEach((exp, i) => {
      const isLeft = i % 2 !== 0;
      const yPos = 1.9 + (i * 0.85);
      
      // Dot
      slide3.addShape(pptx.ShapeType.ellipse, { x: 6.58, y: yPos + 0.1, w: 0.16, h: 0.16, fill: { color: BANA_PURPLE }, line: { color: WHITE, width: 2 } });
      
      // Card
      const cardX = isLeft ? 1.0 : 7.2;
      slide3.addShape(pptx.ShapeType.rect, { 
        x: cardX, y: yPos, w: 5.2, h: 0.75, 
        fill: { color: WHITE }, shadow: { type: "outer", color: "000000", blur: 5 } 
      });
      
      slide3.addText(exp.date, { 
        x: cardX + 0.2, y: yPos + 0.1, w: 4.8, fontSize: 10, color: BANA_PURPLE, fontFace: "Arial", bold: true 
      });
      slide3.addText(exp.title, { 
        x: cardX + 0.2, y: yPos + 0.25, w: 4.8, fontSize: 14, color: TEXT_DARK, fontFace: "Malgun Gothic", bold: true 
      });
      slide3.addText(exp.desc, { 
        x: cardX + 0.2, y: yPos + 0.45, w: 4.8, fontSize: 11, color: TEXT_GRAY, fontFace: "Arial" 
      });
    });

    // 4. Skills (Grid Style)
    let slide4 = pptx.addSlide();
    addSectionTitle(slide4, "SKILLS & EXPERTISE", "Core Competencies");
    
    data.skills.forEach((skill, i) => {
      let xPos = 0.6 + (i * 2.5);
      // Card
      slide4.addShape(pptx.ShapeType.rect, { 
        x: xPos, y: 2.2, w: 2.3, h: 4.2, 
        fill: { color: BANA_LIGHT } 
      });
      
      // Icon Circle
      slide4.addShape(pptx.ShapeType.ellipse, { 
        x: xPos + 0.75, y: 2.6, w: 0.8, h: 0.8, 
        fill: { color: WHITE }, shadow: { type: "outer", color: "000000", blur: 3 } 
      });
      
      slide4.addText(skill.title, { 
        x: xPos, y: 3.8, w: 2.3, align: "center", fontSize: 16, bold: true, color: BANA_PURPLE, fontFace: "Arial" 
      });
      slide4.addText(skill.desc, { 
        x: xPos + 0.1, y: 4.6, w: 2.1, align: "center", fontSize: 12, color: TEXT_GRAY, fontFace: "Malgun Gothic", lineSpacing: 18
      });
    });

    // 5. Philosophy
    let slide5 = pptx.addSlide();
    slide5.background = { color: "0F172A" };
    
    // Background Image (if possible, otherwise dark gradient)
    slide5.addText("PHILOSOPHY", { 
      x: 0, y: 1.2, w: "100%", align: "center", color: BANA_PURPLE, fontSize: 14, bold: true, fontFace: "Arial", charSpacing: 4 
    });
    slide5.addText("현장의 경험을 담아,\n브랜드의 미래를 그립니다.", { 
      x: 0, y: 1.8, w: "100%", align: "center", color: WHITE, fontSize: 44, bold: true, fontFace: "Malgun Gothic" 
    });
    slide5.addShape(pptx.ShapeType.rect, { x: 6.1, y: 3.8, w: 1.1, h: 0.05, fill: { color: BANA_PURPLE } });
    
    slide5.addText(`"${data.philosophy1}"`, { 
      x: 1.5, y: 4.4, w: 10.3, align: "center", color: "CBD5E1", fontSize: 18, italic: true, fontFace: "Malgun Gothic", lineSpacing: 30 
    });
    slide5.addText(`"${data.philosophy2}"`, { 
      x: 1.5, y: 5.8, w: 10.3, align: "center", color: "CBD5E1", fontSize: 18, italic: true, fontFace: "Malgun Gothic" 
    });

    // 6. Closing
    let slide6 = pptx.addSlide();
    slide6.background = { color: WHITE };
    
    // Card Container
    slide6.addShape(pptx.ShapeType.rect, { 
      x: 1.5, y: 1.0, w: 10.3, h: 5.5, 
      fill: { color: BANA_LIGHT } 
    });
    slide6.addShape(pptx.ShapeType.rect, { x: 1.5, y: 1.0, w: 10.3, h: 0.1, fill: { color: BANA_PURPLE } });

    slide6.addText("바나프레소와 함께할\n새로운 도약을 꿈꿉니다.", { 
      x: 1.5, y: 1.8, w: 10.3, align: "center", color: BANA_PURPLE, fontSize: 42, bold: true, fontFace: "Malgun Gothic" 
    });
    slide6.addText(data.closingText1, { 
      x: 2.5, y: 3.8, w: 8.3, align: "center", color: TEXT_GRAY, fontSize: 17, fontFace: "Malgun Gothic", lineSpacing: 28 
    });
    slide6.addText(data.closingText2, { 
      x: 2.5, y: 5.2, w: 8.3, align: "center", color: TEXT_GRAY, fontSize: 17, fontFace: "Malgun Gothic", bold: true 
    });

    pptx.writeFile({ fileName: `Banapresso_Portfolio_${data.name}.pptx` });
  };

  return (
    <div className="snap-container bg-white">
      {/* Edit & Download Buttons */}
      <div className="fixed left-6 bottom-6 z-[100] flex flex-col gap-3">
        <button
          onClick={generatePPTX}
          className="flex items-center gap-2 px-6 py-3 rounded-full shadow-2xl transition-all duration-300 bg-white text-bana-purple border border-bana-purple hover:bg-bana-light"
        >
          <Download size={20} /> Download PPTX
        </button>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-2 px-6 py-3 rounded-full shadow-2xl transition-all duration-300 ${
            isEditing ? 'bg-emerald-500 text-white' : 'bg-bana-purple text-white'
          }`}
        >
          {isEditing ? (
            <><Save size={20} /> Save Changes</>
          ) : (
            <><Edit3 size={20} /> Edit Portfolio</>
          )}
        </button>
      </div>

      {/* Navigation Dots */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            onClick={() => {
              document.querySelectorAll('.snap-section')[i].scrollIntoView({ behavior: 'smooth' });
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              activeSection === i ? 'bg-bana-purple h-8' : 'bg-slate-300 hover:bg-bana-purple/50'
            }`}
          />
        ))}
      </div>

      {/* 1. Cover */}
      <Section id="cover" className="bg-bana-purple text-white">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-white blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-white blur-[120px]" />
        </div>
        
        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <p className="font-display uppercase tracking-[0.3em] text-sm md:text-base mb-6 opacity-80">
              바나프레소 메뉴개발 직무 지원
            </p>
            <h1 className="font-display text-6xl md:text-8xl font-bold mb-8 leading-tight">
              Menu Development<br />Portfolio
            </h1>
            <div className="w-24 h-1 bg-white mx-auto mb-12" />
            <div className="text-xl md:text-2xl font-light tracking-widest uppercase flex items-center justify-center gap-2">
              <span>Applicant:</span>
              <EditableText 
                value={data.name} 
                onChange={(val) => updateData('name', val)} 
                isEditing={isEditing} 
              />
            </div>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-50"
        >
          <ChevronDown size={32} />
        </motion.div>
      </Section>

      {/* 2. About Me */}
      <Section id="about" className="bg-white">
        <div className="max-w-6xl w-full px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="aspect-[3/4] bg-bana-light rounded-2xl overflow-hidden relative group shadow-2xl shadow-purple-100"
          >
            <img 
              src={data.profileImage} 
              alt="Profile" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
            <ImageUpload 
              isEditing={isEditing} 
              onUpload={(url) => updateData('profileImage', url)} 
            />
            <div className="absolute inset-0 border-[20px] border-white/20 pointer-events-none" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-bana-purple font-bold tracking-widest uppercase text-sm mb-4 block">About Me</span>
            <Title>커피와 음료의<br />본질을 이해하는 개발자</Title>
            <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
              <EditableText 
                value={data.aboutText1} 
                onChange={(val) => updateData('aboutText1', val)} 
                isEditing={isEditing} 
                multiline
              />
              <EditableText 
                value={data.aboutText2} 
                onChange={(val) => updateData('aboutText2', val)} 
                isEditing={isEditing} 
                multiline
              />
            </div>
            
            <div className="mt-10 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-slate-500">
                <Mail size={18} className="text-bana-purple" />
                <span className="text-sm">dukhee0522@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <MapPin size={18} className="text-bana-purple" />
                <span className="text-sm">경기도 수원시</span>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* 3. Experience */}
      <Section id="experience" className="bg-bana-light">
        <div className="max-w-5xl w-full px-6">
          <div className="text-center mb-16">
            <span className="text-bana-purple font-bold tracking-widest uppercase text-sm mb-4 block">Experience</span>
            <Title>Professional Journey</Title>
          </div>

          <div className="relative">
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-bana-purple/20 -translate-x-1/2 hidden md:block" />

            <div className="space-y-12">
              {data.experiences.map((exp, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative flex flex-col md:flex-row items-center gap-8 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className="flex-1 w-full md:w-auto text-center md:text-left">
                    <div className={`bg-white p-6 rounded-xl shadow-sm border border-purple-50 ${i % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                      <EditableText 
                        value={exp.date} 
                        onChange={(val) => updateExperience(i, 'date', val)} 
                        isEditing={isEditing} 
                        className="text-bana-purple font-mono text-sm mb-1 block"
                      />
                      <EditableText 
                        value={exp.title} 
                        onChange={(val) => updateExperience(i, 'title', val)} 
                        isEditing={isEditing} 
                        className="text-xl font-bold mb-2 block"
                      />
                      <EditableText 
                        value={exp.desc} 
                        onChange={(val) => updateExperience(i, 'desc', val)} 
                        isEditing={isEditing} 
                        className="text-slate-500 text-sm block"
                      />
                    </div>
                  </div>
                  
                  <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-bana-purple border-4 border-white shadow-sm -translate-x-1/2 z-10 hidden md:block" />
                  
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* 4. Skills */}
      <Section id="skills" className="bg-white">
        <div className="max-w-6xl w-full px-6">
          <div className="text-center mb-20">
            <span className="text-bana-purple font-bold tracking-widest uppercase text-sm mb-4 block">Skills & Expertise</span>
            <Title>Core Competencies</Title>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {data.skills.map((skill, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-2xl bg-bana-light hover:bg-bana-purple hover:text-white transition-all duration-500 text-center flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-6 text-bana-purple group-hover:scale-110 transition-transform duration-500 shadow-sm">
                  {[<TrendingUp />, <Award />, <Settings />, <Coffee />, <Users />][i]}
                </div>
                <EditableText 
                  value={skill.title} 
                  onChange={(val) => updateSkill(i, 'title', val)} 
                  isEditing={isEditing} 
                  className="font-bold text-lg mb-3 block"
                />
                <EditableText 
                  value={skill.desc} 
                  onChange={(val) => updateSkill(i, 'desc', val)} 
                  isEditing={isEditing} 
                  className="text-sm opacity-70 leading-relaxed block"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* 5. Philosophy */}
      <Section id="philosophy" className="bg-slate-900 text-white">
        <div className="absolute inset-0 overflow-hidden opacity-20 group">
          <img 
            src={data.bgImage} 
            alt="Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <ImageUpload 
            isEditing={isEditing} 
            onUpload={(url) => updateData('bgImage', url)} 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/80 to-slate-900" />
        </div>

        <div className="max-w-4xl w-full px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="text-bana-purple font-bold tracking-[0.3em] uppercase text-sm mb-8 block">Philosophy</span>
            <h2 className="font-display text-4xl md:text-6xl font-bold mb-12 leading-tight">
              현장의 경험을 담아,<br />브랜드의 미래를 그립니다.
            </h2>
            <div className="w-20 h-1 bg-bana-purple mx-auto mb-12" />
            <div className="space-y-8 text-lg md:text-xl font-light text-slate-300 leading-relaxed italic">
              <EditableText 
                value={data.philosophy1} 
                onChange={(val) => updateData('philosophy1', val)} 
                isEditing={isEditing} 
                multiline
                className="block mb-4"
              />
              <EditableText 
                value={data.philosophy2} 
                onChange={(val) => updateData('philosophy2', val)} 
                isEditing={isEditing} 
                multiline
                className="block"
              />
            </div>
          </motion.div>
        </div>
      </Section>

      {/* 6. Closing */}
      <Section id="closing" className="bg-white">
        <div className="max-w-4xl w-full px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-bana-light p-12 md:p-20 rounded-[40px] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-bana-purple" />
            
            <Title>바나프레소와 함께할<br />새로운 도약을 꿈꿉니다.</Title>
            
            <div className="space-y-6 text-slate-600 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
              <EditableText 
                value={data.closingText1} 
                onChange={(val) => updateData('closingText1', val)} 
                isEditing={isEditing} 
                multiline
                className="block mb-4"
              />
              <EditableText 
                value={data.closingText2} 
                onChange={(val) => updateData('closingText2', val)} 
                isEditing={isEditing} 
                multiline
                className="block"
              />
            </div>

            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="mailto:dukhee0522@gmail.com"
              className="bg-bana-purple text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl shadow-purple-200 flex items-center gap-3 mx-auto w-fit cursor-pointer"
            >
              Contact Me <CheckCircle2 size={20} />
            </motion.a>
          </motion.div>
          
          <footer className="mt-20 text-slate-400 text-sm">
            © 2026 Portfolio. All rights reserved. Designed for Banapresso.
          </footer>
        </div>
      </Section>
    </div>
  );
}


