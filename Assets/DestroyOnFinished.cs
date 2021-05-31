using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

namespace Assets
{
    class DestroyOnFinished : StateMachineBehaviour
    {
        public override void OnStateEnter(Animator animator, AnimatorStateInfo stateInfo, int layerIndex)
        {
            // base.OnStateEnter(animator, stateInfo, layerIndex);
            Destroy(animator.gameObject, stateInfo.length);
        }
    }
}
