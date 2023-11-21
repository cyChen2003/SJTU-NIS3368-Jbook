from rest_framework import serializers
from comment_cjc.models import Comment

class Comment_cjc_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'