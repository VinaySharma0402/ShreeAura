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

    // ✅ Prepare payload with only changed fields
    const payload: Partial<typeof editedUser> = {};
    Object.keys(editedUser).forEach((key) => {
      const k = key as keyof typeof editedUser;
      if (editedUser[k] !== user[k]) {
        payload[k] = editedUser[k];
      }
    });

    // 🚫 No changes detected
    if (Object.keys(payload).length === 0) {
      toast.info("No changes made");
      setIsEditing(false);
      return;
    }

    try {
      // ✅ Send only changed fields in API payload
      const updatedUser = await updateUserProfile(user.id, payload);

      // ✅ Merge response with local state
      const merged = { ...user, ...updatedUser };
      setUser(merged);
      setEditedUser(merged);

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error(error);
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
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)] text-gray-900">
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
    <div className="min-h-screen bg-[var(--background)] py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-[var(--primary)] drop-shadow-lg mb-2">
            My Profile
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your account, preferences, and summary
          </p>
        </div>

        {/* Profile Header Card */}
        <Card className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden mb-8">
          <CardHeader className="flex flex-col md:flex-row items-center justify-between pb-0">
            <div className="flex items-center space-x-6">
              <Avatar className="w-24 h-24 border-4 border-[var(--primary)]/40 shadow-md">
                <AvatarImage />
                <AvatarFallback className="bg-[var(--primary)] text-white text-3xl font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
          </CardHeader>

          {/* Account Summary */}
          <CardContent className="pt-8 pb-10 px-8">
            <h3 className="text-xl font-semibold text-[var(--primary)] mb-6">
              Account Summary
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {summaryCards.map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  onClick={item.action}
                  transition={{ type: "spring", stiffness: 200 }}
                  className={`rounded-xl p-5 text-center bg-gradient-to-br ${item.color} text-gray-900 shadow-lg cursor-pointer hover:shadow-[var(--primary)]/40 hover:shadow-xl transition-all duration-200`}
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
        <Card className="bg-white border border-gray-200 rounded-2xl shadow-xl">
          <CardContent className="p-8 space-y-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-semibold text-[var(--primary)]">
                Personal Information
              </h3>

              {/* Edit / Save Buttons */}
              <div className="flex gap-2">
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white"
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
                      className="bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90"
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
                    <Label className="text-gray-700 capitalize">{field}</Label>
                    {isEditing ? (
                      <Input
                        value={(editedUser as any)[field] ?? ""}
                        onChange={(e) =>
                          handleInputChange(field as keyof User, e.target.value)
                        }
                        className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                        placeholder={`Enter ${field}`}
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md text-gray-900 border border-gray-200">
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
              className="border-t border-gray-200 pt-6 flex flex-wrap gap-4"
            >
              <Button
                onClick={() => setCurrentPage("orders")}
                className="bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 font-semibold px-6 py-2 flex items-center gap-2"
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
