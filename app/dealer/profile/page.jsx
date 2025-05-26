"use client"

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import dealerApi from '@/app/api/dealer';

export default function DealerProfile() {
  const { toast } = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const data = await dealerApi.getProfile();
      setProfile(data);
      setEditedProfile(data);
      setLoading(false);
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch profile data",
        variant: "destructive",
      });
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleUpdateProfile = async () => {
    try {
      const updatedData = await dealerApi.updateProfile({
        dealershipName: editedProfile.dealershipName,
        dealershipAddress: editedProfile.dealershipAddress,
      });
      setProfile(updatedData);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handlePasswordChange = async () => {
    try {
      await dealerApi.changePassword(newPassword);
      setNewPassword('');
      setShowPasswordChange(false);
      toast({
        title: "Success",
        description: "Password changed successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to change password",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dealer Profile</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {!isEditing ? (
                <>
                  <div>
                    <Label>Full Name</Label>
                    <p className="mt-1">{profile.fullName}</p>
                  </div>
                  <div>
                    <Label>Username</Label>
                    <p className="mt-1">{profile.username}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="mt-1">{profile.email}</p>
                  </div>
                  <div>
                    <Label>Dealership Name</Label>
                    <p className="mt-1">{profile.dealershipName}</p>
                  </div>
                  <div>
                    <Label>Dealership Address</Label>
                    <p className="mt-1">{profile.dealershipAddress}</p>
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <p className="mt-1">{profile.phoneNumber}</p>
                  </div>
                  <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                </>
              ) : (
                <>
                  <div>
                    <Label>Dealership Name</Label>
                    <Input
                      value={editedProfile.dealershipName}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          dealershipName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Dealership Address</Label>
                    <Input
                      value={editedProfile.dealershipAddress}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          dealershipAddress: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleUpdateProfile}>Save Changes</Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setEditedProfile(profile);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
          </CardHeader>
          <CardContent>
            {!showPasswordChange ? (
              <Button onClick={() => setShowPasswordChange(true)}>
                Change Password
              </Button>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label>New Password</Label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handlePasswordChange}>Update Password</Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowPasswordChange(false);
                      setNewPassword('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}