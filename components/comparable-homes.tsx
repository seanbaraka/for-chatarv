import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComparableHomesProps } from "@/lib/types";

export function ComparableHomes({ homes }: ComparableHomesProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparable Homes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {homes.map((home, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 border-b pb-4 last:border-b-0 last:pb-0"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-base">{home.address}</h3>
                  <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                    <span>
                      {home.beds} bed{home.beds !== 1 ? "s" : ""}
                    </span>
                    <span>
                      {home.baths} bath{home.baths !== 1 ? "s" : ""}
                    </span>
                    <span>{home.sqft.toLocaleString()} sqft</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <p className="font-semibold text-lg">
                    {formatPrice(home.price)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ${home.pricePerSqft}/sqft
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
