import { HeroImageUpload } from "@/components/hero-image-upload";

export default function HeroImagesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Hero Image</h1>
      <div className="grid grid-cols-1 gap-6">
        <HeroImageUpload />
      </div>
    </div>
  );
}