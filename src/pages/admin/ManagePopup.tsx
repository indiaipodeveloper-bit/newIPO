import AdminLayout from "@/components/AdminLayout";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Image, Upload, Save, Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { popupApi, uploadApi } from "@/services/api";
import { getImageUrl } from "@/lib/utils";

interface PopupData {
  id?: number;
  title: string;
  description: string;
  image_url: string | null;
  button_text: string;
  button_link: string;
  is_active: boolean;
}

const ManagePopup = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<PopupData>({
    title: "",
    description: "",
    image_url: null,
    button_text: "",
    button_link: "",
    is_active: false
  });

  const fetchPopup = async () => {
    try {
      const data = await popupApi.get();
      if (data) {
        setForm({
          ...data,
          is_active: !!data.is_active
        });
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load popup settings");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopup();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    try {
      const { url } = await uploadApi.upload(file, "popup");
      setForm({ ...form, image_url: url });
      toast.success("Image uploaded!");
    } catch (error: any) {
      toast.error("Upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await popupApi.update({
        ...form,
        is_active: form.is_active ? 1 : 0
      });
      toast.success("Popup settings updated!");
      fetchPopup();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Loading settings...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Website Popup</h1>
          <p className="text-sm text-muted-foreground">Configure the announcement popup that appears on site load</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              {form.is_active ? (
                <Eye className="h-5 w-5 text-brand-green" />
              ) : (
                <EyeOff className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <p className="font-medium text-foreground">Popup Status</p>
                <p className="text-xs text-muted-foreground">
                  {form.is_active ? "Currently visible to users" : "Currently hidden"}
                </p>
              </div>
            </div>
            <Switch 
              checked={form.is_active} 
              onCheckedChange={(checked) => setForm({ ...form, is_active: checked })} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Popup Title</label>
                <Input 
                  placeholder="e.g. New Release" 
                  value={form.title} 
                  onChange={(e) => setForm({ ...form, title: e.target.value })} 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Button Text</label>
                <Input 
                  placeholder="e.g. Learn More" 
                  value={form.button_text} 
                  onChange={(e) => setForm({ ...form, button_text: e.target.value })} 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Button Link</label>
                <Input 
                  placeholder="e.g. /news/new-release" 
                  value={form.button_link} 
                  onChange={(e) => setForm({ ...form, button_link: e.target.value })} 
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Popup Image</label>
                <div className="flex flex-col gap-4">
                  <div className="relative w-full rounded-lg overflow-hidden bg-muted border border-border flex items-center justify-center min-h-[200px] max-h-[400px]">
                    {form.image_url ? (
                      <img 
                        src={getImageUrl(form.image_url)} 
                        alt="Popup" 
                        className="w-full h-auto object-contain max-h-[400px]" 
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                        <Image className="h-8 w-8 mb-2" />
                        <span className="text-xs">No image selected</span>
                      </div>
                    )}
                  </div>
                  <label className="flex items-center justify-center gap-2 cursor-pointer border border-dashed border-border rounded-lg px-4 py-3 hover:border-primary transition-colors bg-background">
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      {uploading ? "Uploading..." : "Click to upload image"}
                    </span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description / Content</label>
            <Textarea 
              rows={4} 
              placeholder="Enter the main content for the popup..." 
              value={form.description} 
              onChange={(e) => setForm({ ...form, description: e.target.value })} 
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button 
              onClick={handleSave} 
              disabled={saving} 
              className="bg-primary text-primary-foreground min-w-[140px]"
            >
              {saving ? "Saving..." : <><Save className="h-4 w-4 mr-2" /> Save Changes</>}
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManagePopup;
