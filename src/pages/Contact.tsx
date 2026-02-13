import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Phone, Mail, User, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
    const { user, session } = useAuth();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<{ full_name: string } | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        limit: "5",
        message: ""
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                email: user.email || "",
            }));

            const fetchProfile = async () => {
                const { data } = await supabase.from("profiles").select("full_name").eq("user_id", user.id).single();
                if (data) {
                    setProfile(data);
                    setFormData(prev => ({ ...prev, name: data.full_name || "" }));
                }
                setLoading(false);
            };
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, [user]);

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div></div>;

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    const handleWhatsAppRedirect = () => {
        const phoneNumber = "923454131372"; // +92 0345 4131372
        const text = `hey SalesPOS manager! I am already to send the request of limits is ${formData.limit} and please accept my request and then if any issue to please replay turely faster...

Details:
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
${formData.message ? `Message: ${formData.message}` : ""}`;

        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
        window.open(url, "_blank");
    };

    return (
        <div className="container max-w-2xl mx-auto py-10 px-4">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-muted/20">
                <CardHeader className="text-center space-y-2 pb-6">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                        <MessageCircle className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-bold">Request Limit Increase</CardTitle>
                    <CardDescription className="text-lg">
                        Need more projects? Contact our support team directly.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="name"
                                    className="pl-9"
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    className="pl-9"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    disabled // Email from auth is best kept read-only or editable? Let's keep it editable/disabled based on preference, currently strictly from auth is safer.
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="phone"
                                    className="pl-9"
                                    type="tel"
                                    placeholder="+92 300 1234567"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="limit">Required Project Limit</Label>
                            <div className="relative">
                                <Shield className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="limit"
                                    className="pl-9"
                                    type="number"
                                    min="1"
                                    placeholder="e.g. 10"
                                    value={formData.limit}
                                    onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message">Additional Message (Optional)</Label>
                            <Textarea
                                id="message"
                                placeholder="Any specific requirements?"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-4 space-y-4">
                        <Button
                            className="w-full h-12 text-lg gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white"
                            onClick={handleWhatsAppRedirect}
                        >
                            <MessageCircle className="w-5 h-5" /> Send on WhatsApp
                        </Button>

                        <div className="bg-muted/50 p-4 rounded-lg text-center text-sm text-muted-foreground space-y-1">
                            <p className="font-medium text-foreground">Direct Support Contact</p>
                            <p>Team of SalesPOS</p>
                            <p className="font-mono text-xs">+92 0345 4131372</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Contact;
