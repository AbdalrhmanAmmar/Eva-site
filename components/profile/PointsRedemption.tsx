"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, DollarSign, ArrowRight, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

interface PointsPackage {
  _id: string;
  points: number;
  price: number;
}

interface PointsRedemptionProps {
  userPoints: number;
  onRedeem?: (points: number) => Promise<boolean>;
}

export default function PointsRedemption({ userPoints, onRedeem }: PointsRedemptionProps) {
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemAmount, setRedeemAmount] = useState<number>(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock points packages
  const pointsPackages: PointsPackage[] = [
    { _id: "1", points: 1000, price: 100 },
    { _id: "2", points: 5000, price: 450 },
    { _id: "3", points: 10000, price: 850 }
  ];

  // Points to currency conversion rate (SAR)
  const pointsToSARRate = 0.1; // 10 points = 1 SAR

  const handleRedeem = async (points: number) => {
    if (points > userPoints) {
      setError("لا تملك نقاط كافية للاستبدال");
      return;
    }

    setIsRedeeming(true);
    setError(null);

    try {
      // If onRedeem callback is provided, use it
      if (onRedeem) {
        const success = await onRedeem(points);
        if (success) {
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        } else {
          throw new Error("فشلت عملية الاستبدال");
        }
      } else {
        // Mock successful redemption
        await new Promise(resolve => setTimeout(resolve, 1000));
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء عملية الاستبدال");
    } finally {
      setIsRedeeming(false);
      setRedeemAmount(0);
    }
  };

  const calculateRedeemValue = (points: number) => {
    return points * pointsToSARRate;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">استبدال النقاط</h2>
        <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-lg">
          <Star className="w-4 h-4 text-primary" />
          <span className="font-medium">{userPoints} نقطة متاحة</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="text-red-500 text-sm">{error}</span>
        </div>
      )}

      {showSuccess && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <span className="text-green-500 text-sm">تم استبدال النقاط بنجاح!</span>
        </div>
      )}

      {/* Custom Redemption */}
      <div className="bg-background/50 rounded-lg border border-border/10 p-4">
        <h3 className="font-medium mb-3">استبدال مخصص</h3>
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="number"
              min="100"
              max={userPoints}
              step="100"
              value={redeemAmount || ""}
              onChange={(e) => setRedeemAmount(Number(e.target.value))}
              placeholder="أدخل عدد النقاط"
              className="w-full px-3 py-2 bg-background border border-border/10 rounded-lg focus:outline-none focus:border-primary/50"
            />
          </div>
          <button
            onClick={() => handleRedeem(redeemAmount)}
            disabled={isRedeeming || redeemAmount <= 0 || redeemAmount > userPoints}
            className="px-4 py-2 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isRedeeming ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <DollarSign className="w-4 h-4" />
                <span>استبدال</span>
              </>
            )}
          </button>
        </div>
        {redeemAmount > 0 && (
          <div className="mt-2 text-sm">
            <span className="text-muted-foreground">القيمة: </span>
            <span className="font-medium text-primary">{calculateRedeemValue(redeemAmount)} ريال</span>
          </div>
        )}
      </div>

      {/* Quick Redemption Options */}
      <div>
        <h3 className="font-medium mb-3">خيارات سريعة</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[100, 500, 1000].map((amount) => (
            <button
              key={amount}
              onClick={() => handleRedeem(amount)}
              disabled={isRedeeming || amount > userPoints}
              className={`p-3 rounded-lg border transition-colors ${
                amount > userPoints
                  ? "border-border/10 bg-background/50 text-muted-foreground opacity-50 cursor-not-allowed"
                  : "border-primary/20 bg-primary/5 hover:bg-primary/10 text-foreground"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">{amount} نقطة</span>
                <Star className="w-4 h-4 text-primary" />
              </div>
              <div className="text-sm text-primary font-medium">
                {calculateRedeemValue(amount)} ريال
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Available Packages */}
      <div>
        <h3 className="font-medium mb-3">حزم النقاط المتاحة</h3>
        <div className="space-y-3">
          {pointsPackages.map((pkg) => (
            <div
              key={pkg._id}
              className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/10"
            >
              <div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-primary" />
                  <span className="font-medium">{pkg.points.toLocaleString()} نقطة</span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  قيمة النقطة: {(pkg.price / pkg.points).toFixed(2)} ريال
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-primary">{pkg.price} ريال</span>
                <button className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Information */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm">
        <h3 className="font-medium text-blue-500 mb-2">معلومات الاستبدال</h3>
        <ul className="space-y-1 text-muted-foreground">
          <li>• الحد الأدنى للاستبدال هو 100 نقطة</li>
          <li>• كل 10 نقاط = 1 ريال سعودي</li>
          <li>• يمكن استخدام الرصيد المستبدل في عمليات الشراء القادمة</li>
          <li>• تنتهي صلاحية الرصيد المستبدل بعد 6 أشهر من تاريخ الاستبدال</li>
        </ul>
      </div>
    </div>
  );
}