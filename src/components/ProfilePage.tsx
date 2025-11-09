import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Edit,
  Save,
  X,
  LogOut,
  Package,
  Star,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import {
  fetchUserProfile,
  updateUserProfile,
  type User,
} from "./services/costumer";
import { fetchOrders } from "./services/costumer";

interface ProfilePageProps {
  setCurrentPage: (page: string) => void;
}

export interface TokenPayload {
  User: User;
  sub: string;
  iat: number;
}

export default function ProfilePage({ setCurrentPage }: ProfilePageProps) {
  const [user, setUser] = useState<User | null>(null);
  const [editedUser, setEditedUser] = useState<User>({} as User);
  const [isEditing, setIsEditing] = useState(false);
  const [orderCount, setOrderCount] = useState<number>(0);
useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);
  // ✅ Fetch user first
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded: TokenPayload = jwtDecode(token);
      fetchUserProfile(decoded.User.id)
        .then((profile) => {
          setUser(profile);
          setEditedUser(profile);
        })
        .catch((err) => console.error("Failed to fetch profile:", err));
    } catch (err) {
      console.error("Failed to decode token:", err);
    }
  }, []);

  // ✅ Fetch order count once user is known
  useEffect(() => {
    async function loadOrders() {
      if (!user?.id) return;
      try {
        const response = await fetchOrders(user.id);
        setOrderCount(response.length);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    }

    loadOrders();
  }, [user]);

  const handleInputChange = (field: keyof User, value: any) => {
    setEditedUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!user?.id) return;
    try {
      const updated: User & { token?: string } = await updateUserProfile(
        user.id,
        editedUser
      );

      if (updated.token) localStorage.setItem("token", updated.token);

      setUser(updated);
      setEditedUser(updated);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser(user as User);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    setCurrentPage("home");
  };

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a0f1a] text-white">
        Loading profile...
      </div>
    );

  // ✅ Summary Cards
  const summaryCards = [
    {
      title: "Orders",
      icon: <Package className="w-8 h-8" />,
      value: orderCount,
      color: "from-[#FF9F45] to-[#FFD369]",
      action: () => setCurrentPage("orders"),
    },
    {
      title: "Reviews",
      icon: <Star className="w-8 h-8" />,
      value: "14",
      color: "from-[#7DFFB1] to-[#FFD369]",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0f1a] via-[#2C1E4A] to-[#1a0f1a] py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-[#FFD369] drop-shadow-lg mb-2">
            My Profile
          </h1>
          <p className="text-white/70 text-lg">
            Manage your account, preferences, and summary
          </p>
        </div>

        {/* Profile Header Card */}
        <Card className="bg-[#2C1E4A]/80 backdrop-blur-md border border-[#FFD369]/30 rounded-2xl shadow-2xl overflow-hidden mb-8">
          <CardHeader className="flex flex-col md:flex-row items-center justify-between pb-0">
            <div className="flex items-center space-x-6">
              <Avatar className="w-24 h-24 border-4 border-[#FFD369]/40 shadow-md">
                <AvatarImage />
                <AvatarFallback className="bg-[#FFD369] text-[#1a0f1a] text-3xl font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                <p className="text-white/70">{user.email}</p>
              </div>
            </div>
          </CardHeader>

          {/* Account Summary */}
          <CardContent className="pt-8 pb-10 px-8">
            <h3 className="text-xl font-semibold text-[#FFD369] mb-6">
              Account Summary
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {summaryCards.map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  onClick={item.action}
                  transition={{ type: "spring", stiffness: 200 }}
                  className={`rounded-xl p-5 text-center bg-gradient-to-br ${item.color} text-[#1a0f1a] shadow-lg cursor-pointer hover:shadow-[#FFD369]/40 hover:shadow-xl transition-all duration-200`}
                >
                  <div className="flex justify-center mb-3">{item.icon}</div>
                  <p className="text-2xl font-extrabold">{item.value}</p>
                  <p className="text-sm font-medium mt-1">{item.title}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Personal Info Section */}
        <Card className="bg-[#2C1E4A]/80 backdrop-blur-md border border-[#FFD369]/30 rounded-2xl shadow-2xl">
          <CardContent className="p-8 space-y-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-semibold text-[#FFD369]">
                Personal Information
              </h3>

              {/* Edit / Save Buttons */}
              <div className="flex gap-2">
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="border-[#FFD369] text-[#FFD369] hover:bg-[#FFD369] hover:text-[#1a0f1a]"
                  >
                    <Edit className="w-4 h-4 mr-2" /> Edit
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                    >
                      <X className="w-4 h-4 mr-2" /> Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      className="bg-[#FFD369] text-[#1a0f1a] hover:bg-[#ffcb47]"
                    >
                      <Save className="w-4 h-4 mr-2" /> Save
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["name", "email", "phone", "address", "city", "state"].map(
                (field) => (
                  <div key={field} className="space-y-2">
                    <Label className="text-white capitalize">{field}</Label>
                    {isEditing ? (
                      <Input
                        value={(editedUser as any)[field] ?? ""}
                        onChange={(e) =>
                          handleInputChange(field as keyof User, e.target.value)
                        }
                        className="bg-[#1a0f1a] border-[#FFD369]/30 text-white placeholder:text-gray-400"
                        placeholder={`Enter ${field}`}
                      />
                    ) : (
                      <div className="p-3 bg-[#1a0f1a] rounded-md text-white border border-[#FFD369]/20">
                        {(user as any)[field] ?? "Not provided"}
                      </div>
                    )}
                  </div>
                )
              )}
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="border-t border-[#FFD369]/20 pt-6 flex flex-wrap gap-4"
            >
              <Button
                onClick={() => setCurrentPage("orders")}
                className="bg-[#FFD369] text-[#1a0f1a] hover:bg-[#ffcb47] font-semibold px-6 py-2 flex items-center gap-2"
              >
                <Package className="w-4 h-4" /> My Orders
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white font-semibold px-6 py-2 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Logout
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
